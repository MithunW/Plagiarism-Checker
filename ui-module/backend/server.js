const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const fs = require('fs');
const pdf = require('pdf-parse');
var mammoth = require("mammoth");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);

// mongoose.set('useFindAndModify', false);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Init gfs
let gfs;

connection.once('open', () => {
  // Init stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/testdb",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  // res.redirect('/');
});
// const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const webPlagiarismRouter = require('./routes/web.plagiarism');
const resultsRouter = require('./routes/result')

// app.use('/exercises', exercisesRouter);

app.use('/checkplagiarism', webPlagiarismRouter);
app.use('/users', usersRouter);
app.use('/results', resultsRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


const storageTemp = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadTemp = multer({storage: storageTemp})
app.post('/readfile', uploadTemp.single('file'), (req, res) => {

  let location='./temp/'+req.file.originalname;
  let dataBuffer="empty"; 
  switch (req.body.filetype) {
      case 'docx':
        mammoth.extractRawText({path:location})
        .then(function(result){
            dataBuffer = result.value;
            var messages = result.messages;
            res.json({ text: dataBuffer });

        })
        .done();    
        break;

      case 'doc':
        mammoth.extractRawText({path:location})
        .then(function(result){
            dataBuffer = result.value; 
            var messages = result.messages;
            res.json({ text: dataBuffer });
        })
        .done();    
        break;

      case 'txt':
        dataBuffer = fs.readFileSync(location,'utf8');
        res.json({ text: dataBuffer });   
        break;

      case 'pdf':
        buffer = fs.readFileSync(location);
        pdf(buffer).then(function(data) {
          res.json({ text: data.text });             
        });    
        break;

    }

});


