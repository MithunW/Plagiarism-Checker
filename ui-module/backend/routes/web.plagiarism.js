const router = require('express').Router();
var stringSimilarity = require('string-similarity');
WordNet = require('../node_modules/node-wordnet/lib/wordnet.js');
var wordnet = new WordNet();
const {google} = require('googleapis');
const puppeteer = require('puppeteer');
const $ = require('cheerio');
extractor = require('unfluff');
var natural = require('natural');


router.route('/text').post((req, res) => {

  const userId = req.body.userId;
  const document = req.body.text;
  var results=[];
  // console.log(userId,document);


  // 01. tokenize the document
  var tokenizer = new natural.RegexpTokenizer({pattern: /\./});
  var tokenize_document = tokenizer.tokenize(document);
  console.log(tokenize_document);
  tokenize_document.forEach(function(sentence, index) {
    if(index==2){
      results.push([sentence,0.85,'https://en.wikipedia.org/wiki/Science']);
    }else{
      results.push([sentence,0.6,'url']);
    }
  });

  res.json({
    result:results,
    plagiarism:75
  });

  // tokenize_document.forEach(function(sentence, index) {
    // async function runSample() {
    //   const customSearch = google.customsearch('v1'); 
    //   const response= await customSearch.cse.list({
    //     auth:'AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU',
    //     cx:'002062490322378734881:fqfodg8bief',
    //     q:sentence,
    //     num:2
    //   });
    //   // console.log(response.data.items);
    //   if(response.data.items.length>0){
    //     // console.log(response.data);
    //     let results=response.data.items;
        
    //     results.forEach(function(result) {
    //       console.log("*****************************");  
    //       console.log(result, index);  
    //     });
    //   }
    // }
    // runSample().catch(console.error);
    
  // });


  // //string matching
  // var similarity = stringSimilarity.compareTwoStrings('hea', 'healed'); 
  // console.log('similarity',similarity*100);
  // var matches = stringSimilarity.findBestMatch('healed', ['edward', 'sealed', 'theatre']);
  // console.log('matches',matches);

  // //wordnet
  // let lemma=[];
  // wordnet.lookup('see', function(results) {
  //     results.forEach(function(result) {
  //       lemma.push(result.lemma.replace("_", " "));
  //         // console.log('------------------------------------');
  //         // console.log(result.synsetOffset);
  //         // console.log(result.pos);
  //         // console.log(result.lemma);
  //         // console.log(result.synonyms);
  //         // console.log(result.pos);
  //         // console.log(result.gloss);
  //     });

  //   var synonyms = new Set(lemma);
  //   console.log([...synonyms]);
  // });

  // // google search api
  // async function runSample() {
  //   const customSearch = google.customsearch('v1'); 
  //   const response= await customSearch.cse.list({
  //     auth:'AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU',
  //     cx:'002062490322378734881:fqfodg8bief',
  //     q:'milk',
  //     // num:2
  //   });
  //   // console.log(response.data.items);
  //   if(response.data.items.length>0){
  //     // console.log(response.data);
  //     let results=response.data.items;
      
  //     results.forEach(function(result) {
  //       console.log("*****************************");  
  //       console.log(result);  
  //     });
  //   }
  // }
  // runSample().catch(console.error);

  // // extract page content
  // const url = 'https://en.wikipedia.org/wiki/IP_address';

  // puppeteer
  //   .launch()
  //   .then(function(browser) {    
  //     return browser.newPage();
  //   })
  //   .then(function(page) {
  //     return page.goto(url).then(function() {
  //       return page.content();
  //     });
  //   })
  //   .then(function(html) {
  //     // console.log(html);
  //     data = extractor(html);
  //     console.log(data.text);
  //   })
  //   .catch(function(err) {
  //     //handle error
  //   });
  
  

  

});

module.exports = router;