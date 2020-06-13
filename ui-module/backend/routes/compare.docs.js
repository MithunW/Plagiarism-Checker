WordNet = require("../node_modules/node-wordnet/lib/wordnet.js");
var wordnet = new WordNet();
sw = require("stopword");
var synonyms = require("synonyms");
var tcom = require('thesaurus-com');
var natural = require("natural");
const { turkey } = require("synonyms/dictionary");
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

    const compare = async (t1,t2, res) => {
        var sentenceList = []
        for (const sen of t1) {
            var s = await getComparableSentances(sen, t2);
            sentenceList.push(s);
        }
        console.log(sentenceList);
        res.json({
            text: sentenceList,
        });
        return sentenceList;
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
            synonymsMap[i].push(i);
        }
        console.log("Done syn");
        return synonymsMap
    }

    const getComparableSentances = async (sen, t2) => {
        var sen = sen.trim();
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

        var palSentence = '';
        var isBreak = false;
        
        t2.forEach((sent) => {
            if(sent.trim().toLowerCase() == sen.trim().toLowerCase()) {
                palSentence = sen.trim();
                isBreak = true;
            }
        });
        if(isBreak) {
            return palSentence;
        }
        sentencesList.some((sentList) => {
            sentence = sentList.join(' ');
            t2.some((s) => {
                if(sentence.trim().toLowerCase() == s.trim().toLowerCase()) {
                    palSentence = s.trim();
                    isBreak = true;
                    return true;
                }
            });
            if(isBreak) {
                return true;
            }
        });
        // console.log(sentences);
        console.log('Done log');
        return palSentence;
    }

    const finalFunc = async (tokenize_text1, tokenize_text2) => {
        var lst = await compare(tokenize_text1, tokenize_text2);
        
    }


    // tokenize_text1 = tokenizer.tokenize('The angry bear chased the frightened little squirrel. hbhj. bj.');
    // tokenize_text2 = tokenizer.tokenize('The furious bear chased the scared small squirrel. This is a step of testing process.');
    tokenize_text1 = tokenizer.tokenize(req.body.text1);
    tokenize_text2 = tokenizer.tokenize(req.body.text2);
    console.log(tokenize_text1);
    console.log(tokenize_text2);
    compare(tokenize_text1, tokenize_text2,res);
    // const text = req.body.text1;
    // console.log(text);
    // res.json({
    //     text: ['j'],
    // });
});

module.exports = router;
