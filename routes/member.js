var express = require('express');
const { isObjectIdOrHexString } = require('mongoose');
var router = express.Router();

// memberSchema 가져오기 import
var Member = require('../models/member');

// 등록
// http://127.0.0.1:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        var obj = new Member();
        obj._id = req.body._id;
        obj.name = req.body.name;
        obj.password = req.body.password;
        obj.email = req.body.email;
        obj.age = Number(req.body.age);
        
        // Member.save
        const result = await obj.save();
        console.log(result);
        if(result._id !== null){
            return res.json({status:200});
        }
        return res.json({status:0});

    } catch(e) {
      console.error(e);
      return res.json({status:-1});
    }
});

// 조회
// http://127.0.0.1:3000/member/select
router.get('/select', async function(req, res, next) {
    try {
        const result = await Member.find({}).sort({_id:-1});
        res.json({status:200, result:result});
    }
    catch(e) {
      console.error(e);
      return res.json({status:-1});
    }
  });

// 수정
// http://127.0.0.1:3000/member/update
// {"_id":"a", "name":"화이팅", "age":100}
router.put('/update', async function(req, res, next) {
    try {
        // 기존 데이터를 읽음
        const obj = await Member.findOne({_id:req.body._id});

        // 변경할 항목(이름, 나이) 설정
        obj.name = req.body.name;
        obj.age = Number(req.body.age);

        // 저장하기 (_id 값이 동일하기 때문에 수정됨)
        const result = await obj.save();
        console.log(result);
        return res.json({status:200});

    }
    catch(e) {
      console.error(e);
      return res.json({status:-1});
    }
  });

// 삭제
// http://127.0.0.1:3000/member/delete
router.delete('/delete', async function(req, res, next) {
    try {
        const id = req.body._id;
        const result = await Member.deleteOne({_id:id});
        console.log(result);
        if(result.deletedCount===1) {
            return res.json({status:200, result:result});
        }
        return res.json({status:0});

    }
    catch(e) {
      console.error(e);
      return res.json({status:-1});
    }
  });



        module.exports = router;