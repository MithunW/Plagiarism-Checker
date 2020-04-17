const router = require('express').Router();
var stringSimilarity = require('string-similarity');
WordNet = require('../node_modules/node-wordnet/lib/wordnet.js');
var wordnet = new WordNet();
// const {google} = require('googleapis');



router.route('/text').post((req, res) => {

  const userId = req.body.userId;
  const text = req.body.text;
  console.log(userId,text);

  res.json({result:"get the text" });

  //string matching
  var similarity = stringSimilarity.compareTwoStrings('hea', 'healed'); 
  console.log('similarity',similarity*100);
  var matches = stringSimilarity.findBestMatch('healed', ['edward', 'sealed', 'theatre']);
  console.log('matches',matches);

  //wordnet
  let lemma=[];
  wordnet.lookup('see', function(results) {
      results.forEach(function(result) {
        lemma.push(result.lemma.replace("_", " "));
          // console.log('------------------------------------');
          // console.log(result.synsetOffset);
          // console.log(result.pos);
          // console.log(result.lemma);
          // console.log(result.synonyms);
          // console.log(result.pos);
          // console.log(result.gloss);
      });

    var synonyms = new Set(lemma);
    console.log([...synonyms]);
  });

  

});

module.exports = router;