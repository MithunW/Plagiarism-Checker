const router = require('express').Router();
const Result = require('../models/result.model');
var MongoClient = require('mongodb').MongoClient;

// Connect to the db


router.route('/').get((req, res) => {
    Result.find({ userId: req.body.userId }).toArray((err, docs) => {
        if (err) {
            console.log(err);
        } else if (!docs || docs.length == 0) {
            res.send("No history");
        } else {

            var files = []
            docs.forEach(doc => {
                const uploadFile = '';
                const resultFile = '';

              /* MongoClient.connect("mongodb://localhost:27017", function (err, client) {
                    if (err) {
                        res.send("Could not connect to DB");
                    }
                    const db = client.db("testdb");
                    const collection = db.collection('uploads.files');
                    const collectionChunks = db.collection('uploads.chunks');
                    collection.find({ filename: doc.files[0] }).toArray(function (err, docs) {
                        if (err) {
                            res.send("DB error");
                        }
                        if (!docs || docs.length === 0) {
                            res.send("No data");
                        } else {

                            //Retrieving the chunks from the db          
                            collectionChunks.find({ files_id: docs[0]._id })
                                .sort({ n: 1 }).toArray(function (err, chunks) {
                                    if (err) {
                                        res.send("Finding chunks error");
                                    }
                                    if (!chunks || chunks.length === 0) {
                                        //No data found            
                                        res.send("No chunk data");
                                    }


                                    for (let i = 0; i < chunks.length; i++) {
                                        //This is in Binary JSON or BSON format, which is stored               
                                        //in fileData array in base64 endocoded string format               

                                        fileData.push(chunks[i].data.toString('base64'));
                                    }
                                    uploadFile = fileData.join('');

                                });

                            collectionChunks.find({ files_id: docs[1]._id })
                                .sort({ n: 1 }).toArray(function (err, chunks) {
                                    if (err) {
                                        res.send("Finding chunks error");
                                    }
                                    if (!chunks || chunks.length === 0) {
                                        //No data found            
                                        res.send("No chunk data");
                                    }


                                    for (let i = 0; i < chunks.length; i++) {
                                        //This is in Binary JSON or BSON format, which is stored               
                                        //in fileData array in base64 endocoded string format               

                                        fileData.push(chunks[i].data.toString('base64'));
                                    }
                                    resultFile = fileData.join('');

                                });
                        }
                    });
                });*/

                var rp = {
                    upload: doc.Files[0],
                    result: doc.Files[1]
                }
                files.push(rp);
            });
            res.send(files);
        }
    });

});

router.route('/add').post((req, res) => {

});

module.exports = router;