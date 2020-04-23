const router = require('express').Router();
let Upload = require('../models/upload.model');

router.route('/getUploads').get((req, res) => {
  Upload.find()
    .then(uploads => res.json(uploads))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addUpload').post((req, res) => {
  const userID = req.body.userID;
  const file = req.body.file;

  const newUpload = new Upload({userID,file});

  newUpload.save()
    .then(() => res.json('Upload added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;