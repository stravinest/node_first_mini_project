const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://stravin:test@3.34.255.91:27017/admin", {
      useNewUrlParser: true,
     
      ignoreUndefined: true

       })
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;