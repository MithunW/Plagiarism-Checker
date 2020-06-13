const router = require('express').Router();
const Result = require('../models/result.model');
var MongoClient = require('mongodb').MongoClient;

// Connect to the db


router.route('/').get((req, res) => {
    Result.find({ userId: req.body.userId }).then((docs) => {
        console.log(req.body.userId);
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