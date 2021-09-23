const mongoose = require("mongoose"); 
//글 등록 schema
const { Schema } = mongoose;
const boardSchema = new Schema({
  date: {
    type: Number,
    required: true,
    //unique: true
  },
  title: {
    type: String,
    required: true,
   // unique: true
  },
  writer: {
    type: String,
    required: true
  },
  pwd: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("board", boardSchema);