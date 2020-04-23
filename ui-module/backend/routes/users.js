const router = require('express').Router();
let User = require('../models/user.model');

// router.route('/').get((req, res) => {
//   User.find()
//     .then(users => res.json(users))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

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

module.exports = router;