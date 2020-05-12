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

// const idToken='eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ODQ4YjVhZmYyZDUyMDEzMzFhNTQ3ZDE5MDZlNWFhZGY2NTEzYzgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSGVtYWthIFJhdmVlbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaURhZWxrQUJLRUVwb3J5d1k3UEUtLUhDQW83NWxHODdLX19uWmZNZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wbGFnaWFyaXNtLWNoZWNrZXItN2JlNjciLCJhdWQiOiJwbGFnaWFyaXNtLWNoZWNrZXItN2JlNjciLCJhdXRoX3RpbWUiOjE1ODg5MjY2NzIsInVzZXJfaWQiOiI1TnpZa0ZFSzZWTWpGVE1wNnZ5MmZFZWR3SmkyIiwic3ViIjoiNU56WWtGRUs2Vk1qRlRNcDZ2eTJmRWVkd0ppMiIsImlhdCI6MTU4ODkyNjY3MiwiZXhwIjoxNTg4OTMwMjcyLCJlbWFpbCI6ImhlbWFrYXJhdmVlbmhhbnNpa2FAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDMxMTYyMDMwMjUyNTUzOTI0NTYiXSwiZW1haWwiOlsiaGVtYWthcmF2ZWVuaGFuc2lrYUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.WWCOHPT8II75wTYrebzO5xbRkHoJINCy7icCNDLLGWcA4Uf44GNC2dj4WNGcOHtH9qQTS5S60pPPV3O2j8TdNjgGt-Qcsaa8tidioIORLtgAcuLOMSYBq-TmHyQvF5rdJzhRHTfCo58yiNY-UExfq2jRikgLLCN7DHY67Wop8K2h92P-w5B4ViPBMYoUqBb6xd9hhNU5C0UWV_QBreOq1-qXEK09ayo9oTryu8R6cgHa9u78aqPeSvx5ca5IjAKWgLt1ShzofvO4216DoVGsXu3FapVZKNuj99Bc44YkKSA9M3TIvXtlo2ib8Bhrl4UFtDsG4FdAKsLtoxwWwYKNkQ';
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// admin.auth().verifyIdToken(idToken)
//   .then(function(decodedToken) {
//     let uid = decodedToken.uid;
//     console.log("token verified");
//     console.log(uid);
//     // ...
// }).catch(function(error) {
//   console.log(error);
// });



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

//check source code plagiarism
const srcplg= require('./routes/srcPlagiarism');
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


