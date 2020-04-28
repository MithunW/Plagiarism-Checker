const router = require('express').Router();

router.route('/').post((req, res) => {
    var src1 = req.body.src1;
    var src2 = req.body.src2;

    res.json({ outpt: src1 });



    console.log(linesaftersplit);



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
        var lines = src1.split("\n");
        var linesaftersplit = [];

        lines.forEach((line) => {

            var newline = [];
            var newline2 = [];
            var name;
            var vals;
            var vars = false;
            var i;

            if (line.startsWith("int")) {
                split("int");
            } else if (line.startsWith("char")) {
                split("char");
            } else if (line.startsWith("float")) {
                split("float");
            } else if (line.startsWith("double")) {
                split("double");
            } else if (line.startsWith("short int")) {
                split("short int");
            } else if (line.startsWith("unsigned int")) {
                split("unsigned int");
            } else if (line.startsWith("long int")) {
                split("long int");
            } else if (line.startsWith("long long int")) {
                split("long long int");
            } else if (line.startsWith("unsigned long int")) {
                split("unsigned long int");
            } else if (line.startsWith("unsigned long long int")) {
                split("unsigned long long int");
            } else if (line.startsWith("signed char")) {
                split("signed char");
            } else if (line.startsWith("unsigned char")) {
                split("unsigned char");
            } else if (line.startsWith("long double")) {
                split("long double");
            }

            function split(type) {
                vars = true;
                line = line.replace(type, '');
                if (line.includes("=")) {
                    var na = line.split("=");
                    name = na[0].split(",");
                    vals = na[1].split(",");

                    for (i = 0; i < name.length; i++) {
                        newline.push(name[i] + "=" + vals[i]);
                    }
                }
                else if (line.includes(",")) {
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
                }
            }
            else if (line != '') {
                linesaftersplit.push(line);
            }

        });
    }

    function tokenization(src) {
        var keywords = ["auto", "break", "case", "char", "continue", "do", "default", "const", "double", "else", "enum", "extern",
            "for", "if", "goto", "float", "int", "long", "register", "return", "signed", "static", "sizeof", "short",
            "struct", "switch", "typedef", "union", "void", "while", "volatile", "unsigned"];

    }

});

module.exports = router;





