const express = require("express");
const bcrypt = require('bcrypt')
const board = require("../schemas/board");

const router = express.Router();

//글등록
router.post('/post', async (req, res) => {
    try {
        const { no,date, title, writer, pwd,content,searchDate} = req.body;
        const encryptedPassword = bcrypt.hashSync(pwd,10)//비밀번호 값
        await board.create({ no,date, title, writer,pwd:encryptedPassword,content,searchDate });
        res.send({ result: "success" });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//메인리스트 뿌리기
router.get("/list", async (req, res, next) => {
    try {
        
        const boards = await board.find({ }).sort("-date");
        res.json({ boards: boards });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//상세 조회
router.get("/detail/:no", async (req, res) => {
    const { no } = req.params;
    const boards = await board.findOne({ no : no });
    res.json({ detail: boards });
});

//상세 수정
router.put('/adjust/:no', async (req, res) => {

    const { no } = req.params;
    const { title,writer,pwd,content }=req.body;
    const boards = await board.findOne({ no : no }); //기존 디피저장패스워드

   
    console.log(bcrypt.compareSync(pwd,boards["pwd"]))

    if(!bcrypt.compareSync(pwd,boards["pwd"])){
        res.send({ result: "fail" }); 
    }
    else{
        await board.updateOne({no},{$set:{title}})
        await board.updateOne({no},{$set:{writer}})
        await board.updateOne({no},{$set:{content}})
        res.send({ result: "success" });    
    }

   
});

//상세삭제
router.delete("/delete/:no", async (req, res) => {
    const { no } = req.params
    const { pwd }=req.body;
    const boards = await board.findOne({ no : no });
    
    if(!bcrypt.compareSync(pwd,boards["pwd"])){
        res.send({ result: "fail" }); 
    }
    else{
    await board.deleteOne({ no });
    res.send({ result: "success" });
    }
})

//검색
router.get("/search", async (req, res) => {
    const {searchText,category  } = req.query;
    if(category=="title"){
    const data = await board.find({title: new RegExp(searchText)}).sort("-date")
    res.json({ data: data });
    }
    else if(category=="writer"){
        const data = await board.find({writer: new RegExp(searchText)}).sort("-date")

        res.json({ data: data })
    }
    else if(category=="date"){  
        const data = await board.find({searchDate: new RegExp(searchText)}).sort("-date") 
        res.json({ data: data })
    }
    else{
        console.log(searchText)
        const data = await board.find({$or: [{title : new RegExp(searchText)},{writer: new RegExp(searchText)},{searchDate: new RegExp(searchText)}]}).sort("-date") 
        console.log(data)
        res.json({ data: data })
      //  await board.find({ : {$search:searchText}})  

    }
    
});

module.exports = router;