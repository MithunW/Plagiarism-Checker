const router = require('express').Router();
let User = require('../models/user.model');
const admin = require("firebase-admin");
const serviceAccount = require("../service-account-key.json");

const verifyToken = (req, res, next) => {
    const idToken = req.headers.authorization;
    // console.log(req.headers);
    admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        let uid = decodedToken.uid;
        console.log("token verified");
        next();
        // console.log(uid);
        // ...
      }).catch(function(error) {
        res.sendStatus(401);
        console.log(error);
      });
};

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

router.route('/update').post(verifyToken,(req, res) => {
  console.log(req.headers);

  const userId = req.body.userId;
  const username = req.body.username;

  var query = {'userId': req.body.userId};

  User.findOneAndUpdate(query,  { username: req.body.username }, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send('Succesfully updated');
  });


});

module.exports = router;