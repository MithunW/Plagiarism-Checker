const router = require('express').Router();
var stringSimilarity = require('string-similarity');
WordNet = require('../node_modules/node-wordnet/lib/wordnet.js');
var wordnet = new WordNet();
const {google} = require('googleapis');
const puppeteer = require('puppeteer');
const $ = require('cheerio');
extractor = require('unfluff');
var natural = require('natural');
var http = require("https");
sw = require('stopword')
const oldString = 'a really Interesting string with some words'.split(' ')
const newString = sw.removeStopwords(oldString)

router.route('/text').post((req, res) => {

  const userId = req.body.userId;
  const document = req.body.text;
  var results_list=[];
  console.log(userId,document);


// 01. tokenize the document
  var tokenizer = new natural.RegexpTokenizer({pattern: /\./});
  var tokenize_document = tokenizer.tokenize(document);
  console.log("tokenize document");
  console.log(tokenize_document);

// 02. remove stopwords and get keywords
  var keyword_document=[];
  
  tokenize_document.forEach(function(sentence, index) {
    var keyword_sentence='';
    const oldString = sentence.split(' ');
    const newString = sw.removeStopwords(oldString);

    newString.forEach(function(keyword, index) {
      keyword_sentence+=(keyword+' ');
    });

    keyword_document.push(keyword_sentence+'.');
    
  });

  console.log("After remove keywords in the tokenize document");
  console.log(keyword_document);

//03. web search API
  console.log("Result from search API");

  async function runSample() {
    const customSearch = google.customsearch('v1'); 
    const response= await customSearch.cse.list({
      auth:'AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU',
      cx:'002062490322378734881:fqfodg8bief',
      q:'what is java',
      num:2
    });
    // console.log(response.data.items);
    if(response.data.items.length>0){
      // console.log(response.data);
      let results=response.data.items;
      
      results.forEach(function(result) {
        console.log("*****************************");  
        console.log(result);  
      });
    }
  }
  runSample().catch(console.error);
  



  tokenize_document.forEach(function(sentence, index) {
    if(index==2){
      results_list.push([sentence,0.85,'https://en.wikipedia.org/wiki/Science']);
    }else{
      results_list.push([sentence,0.6,'url']);
    }
  });

  

  // tokenize_document.forEach(function(sentence, index) {
  //   async function runSample() {
  //     const customSearch = google.customsearch('v1'); 
  //     const response= await customSearch.cse.list({
  //       auth:'AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU',
  //       cx:'002062490322378734881:fqfodg8bief',
  //       q:sentence,
  //       num:2
  //     });
  //     // console.log(response.data.items);
  //     if(response.data.items.length>0){
  //       // console.log(response.data);
  //       let results=response.data.items;
        
  //       results.forEach(function(result) {
  //         console.log("*****************************");  
  //         console.log(result, index);  
  //       });
  //     }
  //   }
  //   runSample().catch(console.error);
  // });


  //04.string matching
  var similarity = stringSimilarity.compareTwoStrings('hea', 'healed'); 
  console.log('similarity',similarity*100);
  var matches = stringSimilarity.findBestMatch('healed', ['edward', 'sealed', 'theatre']);
  console.log('matches',matches);

 //05. wordnet
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

  // google search api
//   async function runSample() {
//     const customSearch = google.customsearch('v1'); 
//     const response= await customSearch.cse.list({
//       auth:'AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU',
//       cx:'002062490322378734881:fqfodg8bief',
//       q:'what is java',
//       num:2
//     });
//     // console.log(response.data.items);
//     if(response.data.items.length>0){
//       // console.log(response.data);
//       let results=response.data.items;
      
//       results.forEach(function(result) {
//         console.log("*****************************");  
//         console.log(result);  
//       });
//     }
//   }
//   runSample().catch(console.error);
// console.log("***********************************************************"); 


  //06. extract page content - web scraping
  const url = 'https://en.wikipedia.org/wiki/IP_address';

  puppeteer
    .launch()
    .then(function(browser) {    
      return browser.newPage();
    })
    .then(function(page) {
      return page.goto(url).then(function() {
        return page.content();
      });
    })
    .then(function(html) {
      // console.log(html);
      data = extractor(html);
      console.log("web scraping");
      console.log(data.text);
    })
    .catch(function(err) {
      //handle error
    });
  
  res.json({
    result:results_list,
    plagiarism:75
  });

});

module.exports = router;