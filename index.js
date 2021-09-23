const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas');
connect();

app.use(express.urlencoded({extended: false})) // 미들 웨어 사용 준비 완료
app.use(express.json())// 데이터를 사용하기 쉽게 가공해주는 미들웨어
app.use(express.static('public'));//어플리케이션의 정적 자산을 제공하는 역할을 하는 static static 사용 선언
app.use((req, res, next) => {
  console.log(req);
  next();
});


const goodsRouter = require("./routers/goods"); // 주소창 /api/다음 주소의 파일들을 routers의 goods라는 파일에 저장
app.use("/api", [goodsRouter]);

app.set('views', __dirname + '/views'); //ejs 세팅 
app.set('view engine', 'ejs');

app.get('/home',(req,res)=>{ //주소창 localhost /home  ->views의  index페이지로 
  res.render('index');

})


 app.get('/detail', (req, res) => {
     res.render('detail');
})
 
 app.get('/cart',(req,res)=>{
    res.render('cart')
 })
 
 app.get('/order',(req,res)=>{
  res.render('order')
})



app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})