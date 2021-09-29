const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas'); //스키마 연결 index.js 
connect();//연결 실행

//아래 미들웨어들은 내부적으로 next를 호출하고 있으므로 연달아 쓸수 있다.
app.use(express.urlencoded({extended: false})) // 미들 웨어 사용 준비 완료
app.use(express.json())// 데이터를 사용하기 쉽게 가공해주는 미들웨어
app.use(express.static('public'));//어플리케이션의 정적 자산을 제공하는 역할을 하는 static static 사용 선언 
app.use((req, res, next) => {
  //console.log(req);
  next();
});


const boardRouter = require("./routers/board"); // 주소창 /api/다음 주소의 파일들을 routers의 goods라는 파일에 저장
app.use("/api", [boardRouter]);

app.set('views', __dirname + '/views'); //ejs 세팅 
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{ //주소창 localhost /  ->views의  index페이지로 
  res.render('index');
})


 app.get('/detail', (req, res) => {//주소창 /detail  페이지 detail이동
     res.render('detail');
})
 
 app.get('/post',(req,res)=>{//주소창 /post  페이지 post이동
    res.render('post')
 })
 

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})