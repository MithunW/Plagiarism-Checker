const router = require('express').Router();
let User = require('../models/user.model');

router.route('/getUsers').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {

  const userId = req.body.userId;
  const username = req.body.username;
  const email = req.body.email;
  console.log(req.body);
  const newUser = new User({userId, username, email});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(function(error) {
      if(error.code==11000){
        res.status(200).json('User already exits in db!')
      }else{
        res.status(400).json('Error: ' + error)       
      }

    });

});

router.route('/update').post((req, res) => {

  const userId = req.body.userId;
  const username = req.body.username;

  var query = {'userId': req.body.userId};

  User.findOneAndUpdate(query,  { username: req.body.username }, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send('Succesfully updated');
  });


});

module.exports = router;