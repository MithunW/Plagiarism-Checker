WordNet = require("../node_modules/node-wordnet/lib/wordnet.js");
var wordnet = new WordNet();
sw = require("stopword");
var synonyms = require("synonyms");
var tcom = require('thesaurus-com');
var natural = require("natural");
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var tokenizer = new natural.RegexpTokenizer({ pattern: /\./ });



const router = require('express').Router();

router.route('/').post((req, res) => {

    function getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    const aaa = async (ts) => {
        var sentenceMap = {}
        for (const sen of ts) {
            await getComparableSentances(sen);
        }
    }

    const getSynonyms = async (a) => {
        var synonymsMap = {}
        for (const i of a) {
            res = await wordnet.lookupAsync(i);
            var s = [];
            res.forEach((r) => {
                s = s.concat(r.synonyms);
            });
            var synonyms = new Set(s);
            synonymsMap[i] = [...synonyms];
        }
        console.log("Done syn");
        return synonymsMap
    }

    const getComparableSentances = async (sen) => {
        console.log(sen);
        var sentencesList = [];
        adjectives = await wordpos.getAdjectives(sen);
        synonyms = await getSynonyms(adjectives);
        var wordSen = sen.split(' ');

        if(synonyms != {}) {
            adjectives.forEach((adj) => {
                var indexes = getAllIndexes(wordSen, adj);
                if(sentencesList.length == 0) {
                    synonyms[adj].forEach((word) => {
                        if(word.trim() != '') {
                            var wordSenCopy = wordSen.slice();
                            indexes.forEach((i) => {
                                wordSenCopy[i] = word.trim();
                            });
                            sentencesList.push(wordSenCopy);
                        }
                    });
                } else {
                    var newSenList = [];
                    synonyms[adj].forEach((word) => {
                        if(word.trim() != '') {
                            sentencesList.forEach((newSen) => {
                                newSenCopy = newSen.slice();
                                indexes.forEach((i) => {
                                    newSenCopy[i] = word;
                                });  
                                newSenList.push(newSenCopy);
                            });
                        }
                    });
                    sentencesList = newSenList;
                }
            });
        }
        // console.log(sentencesList);
        var sentences = [];
        sentencesList.forEach((sentList) => {
            sentences.push(sentList.join(' '));
        });
        // console.log(sentences);
        // console.log(synonyms);
        console.log('Done log');
    }


    tokenize_text = tokenizer.tokenize('The angry bear chased the frightened little squirrel. hbhj. bj.');
    console.log(tokenize_text);
    aaa(tokenize_text);



    const text = req.body.text1;
    console.log(text);
    res.json({
        text: text,
    });
});

module.exports = router;
