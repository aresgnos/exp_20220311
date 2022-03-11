// npm i mongoose --save
var mongoose = require('mongoose');

// npm i --save mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

// 책코드, 책제목, 가격, 저자, 등록일
var bookSchema = new Schema({
    _id : Number,
    title : {type:String, default:''},
    price : {type:Number, default:0},
    author : {type:String, default:''},
    regdate : {type:Date, default:Date.now}
});

// 시퀀스 사용 설정
bookSchema.plugin( AutoIncrement, {id:'SEQ_BOOK8_ID', inc_field:'_id'} )

module.exports = mongoose.model('book8', bookSchema);