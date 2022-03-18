// npm i mongoose --save
var mongoose = require('mongoose');

// npm i --save mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

// 책코드, 책제목, 파일, 파일크기, 파일타입, 파일명, 등록일
var bookSchema = new Schema({
    _id : Number,
    title : {type:String, default:''},
    filedata : {type:Buffer, default:null},
    filesize : {type:Number, default:0},
    filetype : {type:String,  default:''},
    filename : {type:String, default:''},
    regdate : {type:Date, default:Date.now}
});

// 시퀀스 사용 설정
bookSchema.plugin( AutoIncrement, {id:'SEQ_BOOK10_ID', inc_field:'_id'} )

module.exports = mongoose.model('book10', bookSchema);