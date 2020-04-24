const router=require('express').Router();

router.route('/').post((req, res)=>{
    const src1=req.body.src1;
    const src2=req.body.src2;

    res.json({outpt:src1});

    
    var lines=src1.split("\n");
    lines.forEach((line)=>{
        if(line.startsWith("#") || line.startsWith("import")){
            console.log(line)
            const index=lines.indexOf(line);
            console.log(index);
            lines.splice(index, 1);
        }
    });
    console.log(lines);

    
    function preProcessing(src){
        
    }

});

module.exports = router;