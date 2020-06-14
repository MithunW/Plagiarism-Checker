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
const PDF = require('html-pdf');
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

app.get('/download', (req, res) => {
  //Check file exist on MongoDB
  console.log("Nice");
  var filename = req.query.filename;
  console.log(filename);
  gfs.exist({ _id: '5ee2810edb2af75c70cbd9c6' }, (err, file) => {
    console.log(err);
    console.log(file);
    if (err || !file) {
      res.status(404).send('File Not Found');
      return
    }
    console.log(filename);
    var readstream = gfs.createReadStream({ filename: filename });
    readstream.pipe(res);
  });
});

const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  console.log(req.file);
  // res.redirect('/');
});


// const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const webPlagiarismRouter = require('./routes/web.plagiarism');
const resultsRouter = require('./routes/result');
const compareRouter = require('./routes/compare.docs');
const historyRouter = require('./routes/history');

// app.use('/exercises', exercisesRouter);

app.use('/checkplagiarism', webPlagiarismRouter);
app.use('/users', usersRouter);
app.use('/results', resultsRouter)
app.use('/compare', compareRouter);
app.use('/history', historyRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//check source code plagiarism
const srcplg = require('./routes/srcPlagiarism');
app.use('/srcPlagiarism', srcplg);

// var uploadTemp = multer({ dest: './temp' })

const storageTemp = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadTemp = multer({ storage: storageTemp })
app.post('/readfile', uploadTemp.single('file'), (req, res) => {

  let location = './temp/' + req.file.originalname;
  let dataBuffer = "empty";
  switch (req.body.filetype) {
    case 'docx':
      mammoth.extractRawText({ path: location })
        .then(function (result) {
          dataBuffer = result.value;
          var messages = result.messages;
          res.json({ text: dataBuffer });

        })
        .done();
      break;

    case 'doc':
      mammoth.extractRawText({ path: location })
        .then(function (result) {
          dataBuffer = result.value;
          var messages = result.messages;
          res.json({ text: dataBuffer });
        })
        .done();
      break;

    case 'txt':
      dataBuffer = fs.readFileSync(location, 'utf8');
      res.json({ text: dataBuffer });
      break;

    case 'pdf':
      buffer = fs.readFileSync(location);
      pdf(buffer).then(function (data) {
        res.json({ text: data.text });
      });
      break;

  }

});



const pdfTemplate = require('./document');

app.post('/create-pdf', (req, res) => {
  console.log('creating PDF');
  PDF.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
});

app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`)
})
