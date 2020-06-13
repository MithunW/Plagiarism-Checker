const router = require('express').Router();
let Result = require('../models/result.model');

router.route('/').get((req, res) => {
  Result.find()
    .then(results => res.json(results))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  console.log(req.body);
  const userId = req.body.userID;
  const files = req.body.files;
  const checkType = req.body.checktype;
  const similarity = req.body.similarity;

  const newResult = new Result({userId,files,checkType,similarity});

  newResult.save()
    .then(() => res.json('Result added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;