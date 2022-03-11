// 컬렉션 member8, 시퀀스X
// _id 아이디 String
// name 이름 String
// password 암호 String
// email 이메일 String
// age 나이 Number
// regdate Date

// routes/member.js

// member/insert
// member/select

// npm i mongoose --save
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 책코드, 책제목, 가격, 저자, 등록일
var memberSchema = new Schema({
    _id : {type:String, default:''},
    name : {type:String, default:''},
    password : {type:String, default:''},
    email : {type:String, default:''},
    age : {type:Number, default:0},
    regdate : {type:Date, default:Date.now}
});

module.exports = mongoose.model('member8', memberSchema);