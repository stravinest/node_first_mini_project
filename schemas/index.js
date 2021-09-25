const mongoose = require("mongoose"); //mongoose 실행

const connect = () => { //index.js 파일실행시 바로 실행 되어짐
  mongoose
    .connect("mongodb://stravin:test@3.34.255.91:27017/admin", {//아이디 비밀번호@주소설정
      useNewUrlParser: true,
      ignoreUndefined: true

       })
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;