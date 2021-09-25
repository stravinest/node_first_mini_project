const express = require("express");
const bcrypt = require('bcrypt') //비밀번호 
const board = require("../schemas/board"); //디비연결

const router = express.Router(); //express의 라우트 연결

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
    const { no } = req.params; //params로 값을 받아서 그에 맞는 db다시 보내줌
    const boards = await board.findOne({ no : no });
    res.json({ detail: boards });
});

//상세 수정
router.put('/adjust/:no', async (req, res) => {

    const { no } = req.params;
    const { title,writer,pwd,content }=req.body;
    const boards = await board.findOne({ no : no }); //기존 디피저장패스워드
    //기존에 board의 정보 불러서 
   
    console.log(bcrypt.compareSync(pwd,boards["pwd"]))
    //동기적 compare로 입력한 pwd 와 디비의 pwd를 비교 
    if(!bcrypt.compareSync(pwd,boards["pwd"])){
        res.send({ result: "fail" }); 
    }
    else{ //비교해서 맞으면 수정 
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
      //동기적 compare로 입력한 pwd 와 디비의 pwd를 비교 
    if(!bcrypt.compareSync(pwd,boards["pwd"])){
        res.send({ result: "fail" }); 
    }
    else{//비교해서 맞으면 삭제
    await board.deleteOne({ no });
    res.send({ result: "success" });
    }
})

//검색
router.get("/search", async (req, res) => {
    const {searchText,category  } = req.query;
    if(category=="title"){//제목에서 검색
    const data = await board.find({title: new RegExp(searchText)}).sort("-date")
    res.json({ data: data });
    }
    else if(category=="writer"){//작성자에서 검색
        const data = await board.find({writer: new RegExp(searchText)}).sort("-date")

        res.json({ data: data })
    }
    else if(category=="date"){ //날짜 에서 검색  
        const data = await board.find({searchDate: new RegExp(searchText)}).sort("-date") 
        res.json({ data: data })
    }
    else{ //전체 일때
        console.log(searchText)
        const data = await board.find({$or: [{title : new RegExp(searchText)},{writer: new RegExp(searchText)},{searchDate: new RegExp(searchText)}]}).sort("-date") 
        console.log(data)
        res.json({ data: data })
      // $or 셋중에 하나만 맞아도 찾는다. 

    }
    
});

module.exports = router;