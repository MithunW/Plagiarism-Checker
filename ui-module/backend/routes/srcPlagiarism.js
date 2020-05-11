const router = require('express').Router();

router.route('/').post((req, res) => {
    var src1 = req.body.src1;
    var src2 = req.body.src2;

    res.json({ outpt: preProcessing(src1) });

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
        var lines = src.split("\n");
        var linesaftersplit = [];

        lines.forEach((line) => {

            var newline = [];
            var newline2 = [];
            var name;
            var vals;
            var vars = false;
            var i;

            
            if(line.includes("(")){
                
            }else if (line.startsWith("int")) {
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
                }
            }
            else if (line != '') {
                linesaftersplit.push(line);
            }

        });
        console.log(linesaftersplit);

        return linesaftersplit;
    }

    function tokenization(lns) {
        var keywords = ["auto", "break", "case", "char", "continue", "do", "default", "const", "double",
            "else", "enum", "extern", "for", "if", "goto", "float", "int", "long", "register",
            "return", "signed", "static", "sizeof", "short", "struct", "switch", "typedef",
            "union", "void", "while", "volatile", "unsigned"];

        lns.forEach((line) => {
            if (line.startsWith("int") || line.startsWith("float") || line.startsWith("double") ||
                line.startsWith("short int") || line.startsWith("unsigned int") || line.startsWith("long int") ||
                line.startsWith("long long int") || line.startsWith("unsigned long int") ||
                line.startsWith("unsigned long long int") || line.startsWith("long double")) {
                if(line.includes("(")){
                    
                }else if (line.includes("=")) {
                    line = "<numeric_type><identifier>=<numeric_value>";
                } else {
                    line = "<numeric_type><identifier>";
                }
            } else if (line.startsWith("char") || line.startsWith("signed char") || line.startsWith("unsigned char")) {
                if (line.includes("=")) {
                    line = "<char_type><identifier>=<char_value>";
                } else {
                    line = "<char_type><identifier>";
                }
            }
        });
    }

});

module.exports = router;





