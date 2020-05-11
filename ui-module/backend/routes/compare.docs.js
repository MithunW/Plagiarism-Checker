WordNet = require("../node_modules/node-wordnet/lib/wordnet.js");
var wordnet = new WordNet();


const router = require('express').Router();

router.route('/').post((req, res) => {
    let lemma = [];
    wordnet.lookup("bag", function (results) {
        results.forEach(function (result) {
            lemma.push(result.lemma.replace("_", " "));
        });

        var synonyms = new Set(lemma);
        console.log([...synonyms]);
    });
    const text = req.body.text;
    console.log(text);
    res.json({
        text: text,
    });
});

module.exports = router;
