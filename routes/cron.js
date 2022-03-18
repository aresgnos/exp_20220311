var express = require('express');
var router = express.Router();

// npm i node-cron --save
var cron = require('node-cron');

// DB연동 모델
var Book1 = require('../models/book1');

// 10초 간격
// 특정 시점을 정해서 그 때 수행, 초 간격, 주말에만, 요일 등등 가능
cron.schedule('*/10 * * * * *', async () => {
    console.log('aaa');

    // 10초 간격으로 자료저장, 자료이동
    var book1 = new Book1();
    book1.title = "aaa";
    await book1.save();
});



module.exports = router;
