const router = require('express').Router();
const Result = require('../models/result.model');
var MongoClient = require('mongodb').MongoClient;

// Connect to the db


router.route('/').post((req, res) => {
    console.log(req.body.userId);
    Result.find({userId:req.body.userId}).then((docs) => {
        
        var files = []
        docs.forEach(doc => {
            console.log(doc);
            const uploadFile = '';
            const resultFile = '';


            var dates = doc.createdAt;

            var date2=dates.toISOString();
            var date1=date2.split("T");

            var rp = {
                
                upload: doc.files[0],
                result: doc.files[1],
                similarity:doc.similarity,
                date:date1[0]
                
            }
            console.log(rp);
            files.push(rp);
        });
        res.send(files);
        /*if (err) {
            console.log(err);
        } else if (!docs || docs.length == 0) {
            res.send("No history");
        } else {

            var files = []
            docs.forEach(doc => {
                const uploadFile = '';
                const resultFile = '';

              

                var rp = {
                    upload: doc.Files[0],
                    result: doc.Files[1]
                }
                files.push(rp);
            });
            res.send(files);
        }*/
        console.log(docs);
    });

});

router.route('/add').post((req, res) => {

});

module.exports = router;