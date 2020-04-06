const router = require('express').Router();
let Upload = require('../models/upload.model');

router.route('/').get((req, res) => {
  Upload.find()
    .then(uploads => res.json(uploads))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const file = req.body.file;

  const newUpload = new Upload({username,file});

  newUpload.save()
    .then(() => res.json('Upload added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;