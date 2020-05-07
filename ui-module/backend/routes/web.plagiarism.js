const router = require("express").Router();
let Result_model = require('../models/result.model');

var stringSimilarity = require("string-similarity");
WordNet = require("../node_modules/node-wordnet/lib/wordnet.js");
var wordnet = new WordNet();
const { google } = require("googleapis");
const puppeteer = require("puppeteer");
const $ = require("cheerio");
extractor = require("unfluff");
var natural = require("natural");
var http = require("https");
sw = require("stopword");
const oldString = "a really Interesting string with some words".split(" ");
const newString = sw.removeStopwords(oldString);

var results_list = [];
var tokenize_document=[];
var process=0;
var total_process=0;
var count=0;
var userId='';

router.route("/text").post((req, res) => {
  userId = req.body.userId;
  const document = req.body.text;

  process=0;
  total_process=0;
  results_list = [];
  tokenize_document=[];
  count=0;
  // console.log(userId, document);

  // 01. tokenize the document
  var tokenizer = new natural.RegexpTokenizer({ pattern: /\./ });
  tokenize_document = tokenizer.tokenize(document);
  console.log("tokenize document");
  // console.log(tokenize_document);

  // 02. remove stopwords and get keywords
  var keyword_document = [];

  tokenize_document.forEach(function (sentence, index) {
    var keyword_sentence = "";
    const oldString = sentence.split(" ");
    const newString = sw.removeStopwords(oldString);

    newString.forEach(function (keyword, index) {
      keyword_sentence += keyword + " ";
    });

    keyword_document.push(keyword_sentence + ".");
  });

  console.log("After remove keywords in the tokenize document");
  // console.log(keyword_document);

  //03. web search API
  // console.log("Result from search API");

  // async function runSample() {
  //   const customSearch = google.customsearch("v1");
  //   const response = await customSearch.cse.list({
  //     auth: "AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU",
  //     cx: "002062490322378734881:fqfodg8bief",
  //     q: "what is java",
  //     num: 2,
  //   });
  //   // console.log(response.data.items);
  //   if (response.data.items.length > 0) {
  //     // console.log(response.data);
  //     let results = response.data.items;

  //     results.forEach(function (result) {
  //       console.log("*****************************");
  //       console.log(result);
  //     });
  //   }
  // }
  // runSample().catch(console.error);

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
  // var similarity = stringSimilarity.compareTwoStrings("hea", "healed");
  // console.log("similarity", similarity * 100);
  // var matches = stringSimilarity.findBestMatch("healed", [
  //   "edward",
  //   "sealed",
  //   "theatre",
  // ]);
  // console.log("matches", matches);

  //05. wordnet
  // let lemma = [];
  // wordnet.lookup("see", function (results) {
  //   results.forEach(function (result) {
  //     lemma.push(result.lemma.replace("_", " "));
  //   });

  //   var synonyms = new Set(lemma);
  //   console.log([...synonyms]);
  // });

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
  const url_list = ["https://en.wikipedia.org/wiki/Java_(programming_language)","https://en.wikipedia.org/wiki/Science","https://www.space.com/56-our-solar-system-facts-formation-and-discovery.html"];
  const target_list = [];

  url_list.forEach(function (url, index) {
    puppeteer
    .launch()
    .then(function (browser) {
      return browser.newPage();
    })
    .then(function (page) {
      return page.goto(url).then(function () {
        return page.content();
      });
    })
    .then(function (html) {
      // console.log(html);
      data = extractor(html);
      console.log("web scraping");
      // console.log(data.text);
      // target_text=data;
      // compareText(data.text);
      target_list.push(data.text);

      if(url_list.length==target_list.length){
        getTargetText();
      }

    })
    .catch(function (err) {
      // console.log("Scraping error - ", err);
    });
  });

  

  

  function getTargetText() {
    target_list.forEach(function (target_text, index) {
      console.log("compare text - ", index, " start");
      var tokenize_target_document = tokenizer.tokenize(target_text);
      compareText(tokenize_target_document, index);
    });
  }

  function compareText(tokenize_target_document, target_index) {
    tokenize_document.forEach(function (sentence, index) {
      var matches = stringSimilarity.findBestMatch(
        sentence,
        tokenize_target_document
      );

      if(target_index>0){
        if(matches.bestMatch.rating>results_list[index][1]){
          // console.log(index,results_list[index][1],' ',matches.bestMatch.rating,);
          results_list[index][1]=matches.bestMatch.rating;
          results_list[index][2]=url_list[target_index];
        }
      }else{
        results_list.push([sentence, matches.bestMatch.rating, url_list[target_index]]);
      }

      if(matches.bestMatch.rating>=0.8){
        count+=1
      }

      console.log("matches - ", index, " - ", results_list[index][1], " - ", results_list[index][2]);
      // process+=1;
      
    });
  }



  // tokenize_document.forEach(function (sentence, index) {
  //   var similarity = stringSimilarity.compareTwoStrings(sentence, traget_text);
  //   console.log("similarity - ",index,' - ', similarity * 100);
  // });

  // tokenize_document.forEach(function (sentence, index) {
  //   if (index == 2) {
  //     results_list.push([
  //       sentence,
  //       0.85,
  //       "https://en.wikipedia.org/wiki/Science",
  //     ]);
  //   } else {
  //     results_list.push([sentence, 0.6, "url"]);
  //   }
  // });

  // res.json( 'Checking' );
  res.json({
    length: tokenize_document.length,
  });
});

// router.route("/result-progress").get((req, res) => {
//   var progress=0;
//   if (total_process!=0) {
//     progress=process/total_process*100;
//   }
//   res.json({
//     progress: progress
//   });

//   console.log("Progress - ", progress);

// });

router.route("/result").get((req, res) => {

  console.log("count-  ",count/tokenize_document.length*100);
  if (results_list.length <=tokenize_document.length) {
    res.json({
      result: results_list,
      plagiarism: count/tokenize_document.length*100,
    });
  }
});

router.route("/result-save").post((req, res) => {
  
  const files = results_list;
  const checkType = 'web-plagiarism';
  
  const newResult = new Result_model({userId, files, checkType});

  newResult.save()
    .then(() => res.json({
        status: 'Result added!'
      }))
    .catch(function(error) {
      res.status(400).json('Error: ' + error)       
    });
});

module.exports = router;
