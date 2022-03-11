var express = require('express');
const { isObjectIdOrHexString } = require('mongoose');
var router = express.Router();

// bookSchema 가져오기 import
var Book = require('../models/book');

// 등록
// http://127.0.0.1:3000/book/insert
// {'title:'통합구현', 'price':1200, 'author':'가나다'}
router.post('/insert', async function(req, res, next) {
    try {
        // var 객체명 = new 클래스명();
        var obj = new Book();
        obj.title = req.body.title;
        obj.price = Number(req.body.price);
        obj.author = req.body.author;

        const result = await obj.save();
        console.log(result);
        if(result._id > 0 ){

          return res.json({status:200});
        }
        return res.json({status:0});
    }
    catch(e) {
      console.error(e);
      return res.json({status:-1});
    }
});

// 조회
// http://127.0.0.1:3000/book/select
router.get('/select', async function(req, res, next) {
  try {
      const result = await Book.find({}).sort({_id:-1});
      res.json({status:200, result:result});
  }
  catch(e) {
    console.error(e);
    return res.json({status:-1});
  }
});


module.exports = router;
