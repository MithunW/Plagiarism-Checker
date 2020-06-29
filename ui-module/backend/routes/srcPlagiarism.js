const router = require('express').Router();

router.route('/').post((req, res) => {
    var src1 = req.body.src1;
    var src2 = req.body.src2;

    var src1lines=[];
    var src2lines=[];

    var pr1 = preProcessing(src1);
    var pr2 = preProcessing(src2);
    var tk1 = tokenization(pr1);
    var tk2 = tokenization(pr2);
    var ot1 = plagiarismPercentage(tk1, tk2);
    res.json({ outpt: "Plagiarised percentage : " + ot1 + "%", line1:src1lines, line2:src2lines, source1:pr1, source2:pr2 });

    function preProcessing(src) {

        //remove multiline comments
        var until = true;
        while (until) {
            let in1, in2 = 0;
            until = false;
            in1 = src.indexOf("/*");
            in2 = src.indexOf('*/');

            if (in1 >= 0 && in2 > 0) {
                let cmnt = src.substring(in1, in2 + 2);
                src = src.replace(cmnt, '');
                until = true;
            }

        }

        //remove single line comments
        until = true;
        while (until) {
            let in1, in2 = 0;
            until = false;
            in1 = src.indexOf("//");
            in2 = src.substring(in1).indexOf("\n") + in1;

            if (in1 >= 0 && in2 > in1) {
                let cmnt = src.substring(in1, in2 + 1);
                src = src.replace(cmnt, '');
                until = true;
            }
        }

        //remove include statements
        until = true;
        while (until) {
            let in1, in2 = 0;
            until = false;
            in1 = src.indexOf("#include");
            in2 = src.substring(in1).indexOf("\n") + in1;

            if (in1 >= 0 && in2 > in1) {
                let cmnt = src.substring(in1, in2 + 1);
                src = src.replace(cmnt, '');
                until = true;
            }
        }

        //split combined variable declarations and remove empty lines
        //console.log(src);
        var lines = src.split("\n");
        //console.log(lines);
        var linesaftersplit = [];
        var keyNo = 1;
        var lineSplit = new Object();

        lines.forEach((line) => {


            var newline = [];
            var newline2 = [];
            var name;
            var vals;
            var vars = false;
            var i;


            if (line.includes("(")) {

            } else if (line.startsWith("int")) {
                seperate("int");
            } else if (line.startsWith("char")) {
                seperate("char");
            } else if (line.startsWith("float")) {
                seperate("float");
            } else if (line.startsWith("double")) {
                seperate("double");
            } else if (line.startsWith("short int")) {
                seperate("short int");
            } else if (line.startsWith("unsigned int")) {
                seperate("unsigned int");
            } else if (line.startsWith("long int")) {
                seperate("long int");
            } else if (line.startsWith("long long int")) {
                seperate("long long int");
            } else if (line.startsWith("unsigned long int")) {
                seperate("unsigned long int");
            } else if (line.startsWith("unsigned long long int")) {
                seperate("unsigned long long int");
            } else if (line.startsWith("signed char")) {
                seperate("signed char");
            } else if (line.startsWith("unsigned char")) {
                seperate("unsigned char");
            } else if (line.startsWith("long double")) {
                seperate("long double");
            }

            function seperate(type) {
                vars = true;
                line = line.replace(type, '');
                if (line.includes(",")) {
                    name = line.split(",");
                    for (i = 0; i < name.length; i++) {
                        newline.push(name[i]);
                    }

                } else {
                    newline.push(line);
                }

                console.log(name);
                for (i = 0; i < name.length; i++) {
                    newline2.push(type + " " + newline[i]);
                }
            }

            if (vars) {
                for (i = 0; i < newline2.length; i++) {
                    linesaftersplit.push(newline2[i]);
                    lineSplit[keyNo] = newline2[i];
                    keyNo = keyNo + 1;
                }
            }
            else if (line != '') {
                linesaftersplit.push(line);
                lineSplit[keyNo] = line;
                keyNo = keyNo + 1;
            }

        });
        //console.log(linesaftersplit);

        return linesaftersplit;
    }

    function tokenization(lns) {
        var linesAfterToken = [];
        var linesToken = new Object();
        var keyNo = 0;
        var keywords = ["auto", "break", "case", "char", "continue", "do", "default", "const", "double",
            "else", "enum", "extern", "for", "if", "goto", "float", "int", "long", "register",
            "return", "signed", "static", "sizeof", "short", "struct", "switch", "typedef",
            "union", "void", "while", "volatile", "unsigned"];

        

        lns.forEach((line) => {
            line = line.trim();
            if (line.startsWith("void")) {
                linesAfterToken.push("<void><identifier_class>");
                linesToken[keyNo]="<void><identifier_class>";

            } else if (line.startsWith("int") || line.startsWith("float") || line.startsWith("double") ||
                line.startsWith("short int") || line.startsWith("unsigned int") || line.startsWith("long int") ||
                line.startsWith("long long int") || line.startsWith("unsigned long int") ||
                line.startsWith("unsigned long long int") || line.startsWith("long double")) {

                if (line.includes("(")) {
                    linesAfterToken.push("<numeric_type><identifier_class>");
                    linesToken[keyNo]="<numeric_type><identifier_class>";
                } else if (line.includes("=")) {
                    linesToken[keyNo]="<numeric_type><identifier_variable>=<numeric_value>";
                } else {
                    linesAfterToken.push("<numeric_type><identifier_variable>");
                    linesToken[keyNo]="<numeric_type><identifier_variable>";
                }

            } else if (line.startsWith("char") || line.startsWith("signed char") || line.startsWith("unsigned char")) {
                if (line.includes("(")) {
                    linesAfterToken.push("<char_type><identifier_class>");
                    linesToken[keyNo]="<char_type><identifier_class>";
                }
                else if (line.includes("=")) {
                    linesAfterToken.push("<char_type><identifier_variable>=<char_value>");
                    linesToken[keyNo]="<char_type><identifier_variable>=<char_value>";
                } else {
                    linesAfterToken.push("<char_type><identifier_variable>");
                    linesToken[keyNo]="<char_type><identifier_variable>";
                }
            }

            else if (line.startsWith("for")) {
                linesAfterToken.push("<for>");
                linesToken[keyNo]="<for>";
            } else if (line.startsWith("if")) {
                linesAfterToken.push("<if>");
                linesToken[keyNo]="<if>";
            } else if (line.startsWith("while")) {
                linesAfterToken.push("<while>");
                linesToken[keyNo]="<while>";
            } else if (line.startsWith("printf")) {
                linesAfterToken.push("<print>");
                linesToken[keyNo]="<print>";
            } else if (line.startsWith("scanf")) {
                linesAfterToken.push("<scan>");
                linesToken[keyNo]="<scan>";
            } else if (line == '') {
                linesAfterToken.push("");
                linesToken[keyNo]="";
            } else {
                linesAfterToken.push(line);
                linesToken[keyNo]=line;
            }

            keyNo = keyNo +1;
        });
        //console.log(linesAfterToken);
        return linesToken;
    }


    //check similarity percentage using greedy string tiling
    function plagiarismPercentage(src1, src2) {
        console.log(src1);
        console.log(src2);
        var tiles = [];
        do {
            var maxMatch = 1;
            matches = [];
            let j;
            var cln1 = 0;
            var cln2;

            for(var key in src1){

                ln1=src1[key];
                
                if (ln1 != null) {
                    cln2 = 0;

                    for(var key1 in src2){
                        ln2=src2[key1];
                        if (ln2 != null) {
                            j = 0;
                            // console.log(src1[cln1 + j] + "   " + src2[cln2 + j]);
                            while (src1[cln1 + j] == src2[cln2 + j] && src1[cln1 + j] != null && src2[cln2 + j] != null) {
                                //console.log(src1[cln1 + j] + "    "+src2[cln2 + j]);
                                j++;
                            }
                            if (j == maxMatch) {
                                console.log("a " + maxMatch);
                                matches.push([cln1, cln2, j]);
                            } else if (j > maxMatch) {
                                matches.splice(0, matches.length);
                                matches.push([cln1, cln2, j]);
                                maxMatch = j;
                                console.log("b " + maxMatch);
                            }
                            //console.log(maxMatch);
                        }
                        cln2++;
                    }
                   
                    console.log(matches);

                    //console.log(maxMatch);
                    //console.log(src1);
                }
                cln1++;
            }


          /*  src1.forEach((ln1) => {

                if (ln1 != null) {
                    cln2 = 0;
                    src2.forEach((ln2) => {

                        if (ln2 != null) {
                            j = 0;
                            // console.log(src1[cln1 + j] + "   " + src2[cln2 + j]);
                            while (src1[cln1 + j] == src2[cln2 + j] && src1[cln1 + j] != null && src2[cln2 + j] != null) {
                                j++;
                            }
                            if (j == maxMatch) {
                                console.log("a " + maxMatch);
                                matches.push([cln1, cln2, j]);
                            } else if (j > maxMatch) {
                                matches.splice(0, matches.length);
                                matches.push([cln1, cln2, j]);
                                maxMatch = j;
                                console.log("b " + maxMatch);
                            }
                            //console.log(maxMatch);
                        }
                        cln2++;
                    });
                    console.log(matches);

                    //console.log(maxMatch);
                    //console.log(src1);
                }
                cln1++;
            }); */
            matches.forEach((match) => {
                var count;
                for (count = 0; count < match[2]; count++) {
                    src1[match[0] + count] = null;
                    src1lines.push(match[0] + count);

                    src2[match[1] + count] = null;
                    src2lines.push(match[1] + count);
                }
                tiles.push(match);
            });

        } while (maxMatch > 1);


        console.log(tiles);
        var totlen = 0;
        tiles.forEach((tile) => {
            totlen = totlen + tile[2];
        });

        console.log(totlen);
        console.log(Object.keys(src1).length + Object.keys(src2).length);
        var percentage = (2 * totlen) / (Object.keys(src1).length + Object.keys(src2).length);
        console.log(percentage * 100);
        return ((percentage * 100).toFixed(2));

    }

});

module.exports = router;





