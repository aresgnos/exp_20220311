var express = require('express');
var router = express.Router();

// 이미지 첨부 모듈
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()}); // DB에 이미지 저장, disk는 파일 위치 정해서 첨부 가능

// 저장
var Book1 = require('../models/book1');

// 이미지 등록
// 127.0.0.1:3000/upload/insert
// single은 하나, array는 여러개
router.post('/insert', upload.single("img"), async function(req, res, next) { // ket : img
    try {
        console.log(req.body);
        console.log(req.file);

        var book1 = new Book1();
        book1.title = req.body.title;
        if(typeof req.file !== 'undefined'){ // if문에 영향을 받는 부분만 넣음, 파일 첨부를 하지 않으면 models의 default 값으로 아래 값들을 설정하겠다.
            book1.filedata = req.file.buffer;
            book1.filesize = req.file.size;
            book1.filetype = req.file.mimetype;
            book1.filename = req.file.originalname;   
        }
        await book1.save();
        
        res.send({status:200});
    }catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});
    

// 이미지 url 만들기
// 127.0.0.1:3000/upload/image?no=1
// <img src = "/updload/image?no=1" />
router.get('/image', async function(req, res, next) {
    try {
        const query = {_id : Number(req.query.no)};
        const book1 = await Book1.findOne(query).select({title:0});
        // console.log(book1);
        // 이미지 출력
        res.contentType(book1.filetype);
        res.send(book1.filedata);

    }catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});



module.exports = router;
