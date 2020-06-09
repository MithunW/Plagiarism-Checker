const router = require("express").Router();
let Result_model = require("../models/result.model");
const admin = require("firebase-admin");
const serviceAccount = require("../service-account-key.json");

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
var tokenize_document = [];
var url_list = [];
var target_list = [];
var process = 0;
var total_process = 0;
var count = 0;
var userId = "";

const verifyToken = (req, res, next) => {
  const idToken = req.headers.authorization;
  // console.log(req.headers);
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;
      // console.log("token verified");
      next();
      // console.log(uid);
      // ...
    })
    .catch(function (error) {
      res.sendStatus(401);
      console.log(error);
    });
};

router.route("/text").post(verifyToken, (req, res) => {
  // console.log(req.headers);
  userId = req.body.userId;
  const document = req.body.text;
  const request_url= req.body.urlList;
  if(request_url.length>0){
    url_list=request_url;
  }

  process = 0;
  total_process = 0;
  results_list = [];
  tokenize_document = [];
  target_list = [];
  url_list = [];
  // url_list = [
  //   "https://en.wikipedia.org/wiki/Java_(programming_language)",
  //   "https://en.wikipedia.org/wiki/Science",
  //   "https://www.space.com/56-our-solar-system-facts-formation-and-discovery.html"
  // ];
  count = 0;
  // console.log(userId, document);
  if(request_url.length>0){
    url_list=request_url;
  }

  // 01. tokenize the document
  var tokenizer = new natural.RegexpTokenizer({ pattern: /\./ });
  tokenize_document = tokenizer.tokenize(document);
  console.log("tokenize document", tokenize_document.length);
  // console.log(tokenize_document);

  // 02. remove stopwords and get keywords
  var keyword_document = [];
  var word_count = 0;
  var search_query = "";

  tokenize_document.forEach(function (sentence, index) {
    var keyword_sentence = "";
    const oldString = sentence.split(" ");
    const newString = sw.removeStopwords(oldString);

    newString.forEach(function (keyword, index) {
      keyword_sentence += keyword + " ";
      word_count += 1;
      if (word_count % 32 == 0) {
        var i=word_count /32;
        // console.log(search_query, i);
        // customSearch(search_query, i).catch(console.error);


        search_query = "";
      } else {
        search_query += keyword + " ";
      }
    });
    keyword_document.push(keyword_sentence + ".");
    if(keyword_document.length==tokenize_document.length){
      console.log("After remove keywords in the tokenize document", keyword_document.length);
      scrap(url_list);
    }
  });

  // console.log(keyword_document);

  // keyword_document.forEach(function (keyword_sentence, index) {
  //   var word_count=0;
  //   var search_query="";
  //   console.log("key word......");
  //   console.log(keyword_sentence);
  //   var keyword_list = keyword_sentence.split(" ");
  //   keyword_list.forEach(function (keyword, index) {
  //     word_count+=1
  //     if(word_count%32==0){
  //       console.log(search_query);
  //       console.log(" ");
  //       search_query="";
  //     }else{
  //       search_query+=keyword+" ";
  //     }

  //   });
  // });

  //03. web search API
  // console.log("Result from search API");

  async function customSearch(search_query, i) {
    const customSearch = google.customsearch("v1");
    const response = await customSearch.cse.list({
      auth: "AIzaSyDft4KwXd4xfoLk6eCrIPPgpsEJXDk57FU",
      cx: "002062490322378734881:fqfodg8bief",
      q: search_query,
      num: 1,
    });
    // console.log(response.data.items);
    // if (response.data.items.length > 0) {
      // console.log(response);
      let results = response;
      console.log(i);
      console.log(search_query);
      console.log(results.data.items[0].link);
      console.log(" ------------------------------------- ");
      url_list.push(results.data.items[0].link);

      // let results = response.data.items;

      // results.forEach(function (result) {
      //   console.log("*****************************");
      //   console.log(result);
      // });
    // }
  }

  //05. wordnet
  // let lemma = [];
  // wordnet.lookup("see", function (results) {
  //   results.forEach(function (result) {
  //     lemma.push(result.lemma.replace("_", " "));
  //   });

  //   var synonyms = new Set(lemma);
  //   console.log([...synonyms]);
  // });

  //06. extract page content - web scraping
  

  function scrap(url_list) {
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
          // console.log(data.text);
          // target_text=data;
          // compareText(data.text);
          target_list.push(data.text);
          console.log("web scraping",target_list.length);

          if (url_list.length == target_list.length) {
            console.log("finished web scraping");
            getTargetText();
          }
        })
        .catch(function (err) {
          // console.log("Scraping error - ", err);
        });
    });
  }
  

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

      if (target_index > 0) {
        if (matches.bestMatch.rating > results_list[index][1]) {
          console.log(index,results_list[index][1],' ',matches.bestMatch.rating,);
          results_list[index][1] = matches.bestMatch.rating;
          results_list[index][2] = url_list[target_index];
        }
      } else {
        results_list.push([ sentence, matches.bestMatch.rating, url_list[target_index]]);
      }

      if (matches.bestMatch.rating >= 0.8) {
        count += 1;
      }

      console.log( "matches - ", index, " - ", results_list[index][1], " - ", results_list[index][2] );
      // process+=1;
    });
  }


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

router.route("/result").get(verifyToken, (req, res) => {
  console.log("count-  ", (count / tokenize_document.length) * 100);
  if (results_list.length <= tokenize_document.length) {
    res.json({
      result: results_list,
      plagiarism: (count / tokenize_document.length) * 100,
    });
  }
});

router.route("/result-save").post(verifyToken, (req, res) => {
  const files = results_list;
  const checkType = "web-plagiarism";

  const newResult = new Result_model({ userId, files, checkType });

  newResult
    .save()
    .then(() =>
      res.json({
        status: "Result added!",
      })
    )
    .catch(function (error) {
      res.status(400).json("Error: " + error);
    });
});

module.exports = router;
