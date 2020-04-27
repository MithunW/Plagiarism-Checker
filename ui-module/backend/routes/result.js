const router = require('express').Router();
let Result = require('../models/result.model');

router.route('/').get((req, res) => {
  Result.find()
    .then(results => res.json(results))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const userID = req.body.userID;
  const file = req.body.file;
  const checkType = req.body.checktype;

  const newResult = new Result({userID,file,checkType});

  newResult.save()
    .then(() => res.json('Result added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;