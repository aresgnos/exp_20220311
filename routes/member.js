var express = require('express');
const { isObjectIdOrHexString } = require('mongoose');
var router = express.Router();

// 문자를 HASH하기
// 우리가 하는 암호를 못 알아보게 변경 ex a=>4jlkjs245234jlsdjasdf
// 원래대로 복원할 수 없다. a를 변경하는건 가능하나 변경한걸 a로 바꾸는건 X
const crypto = require('crypto');

// 토큰 발행
const auth = require('../token/auth');
const jwt = require('jsonwebtoken');

// memberSchema 가져오기 import
var Member = require('../models/member');


// 회원정보 1개 조회
// http://127.0.0.1:3000/member/selectone
router.get('/selectone', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID; // 토큰에서 추출

        // 아이디에 해당하는 값을 조회
        const result = await Member.findOne({_id : sessionID}).select({"name":1, "age":1});
        console.log(result);
        if(result !== null){
          return res.send({status:200, result:result})
        }
        return res.send({status:0, result:0});

    }catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});


// 회원정보수정 (로그인, 토큰), 이름과 나이 변경
// http://127.0.0.1:3000/member/update
// {"name":"변경이름", "age":1234}
router.put('/update', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID; // 토큰에서 추출
        const name = req.body.name; // 전달된 값
        const age = req.body.age; // 전달된 값

        // 아이디에 해당하는 값을 조회 후 변경할 항목 2개 변경
        const Member1 = await Member.findOne({_id:sessionID});
        Member1.name = name;
        Member1.age = age;

        console.log(Member1);

        const result = await Member1.save();
        if(result._id !== ''){
          return res.send({status:200})
        }
        return res.send({status:0});
        
    } catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});


// 암호 변경 (로그인, 토큰 유)
// {"pw":"aaa", "newpw":"bbb"}
// http://127.0.0.1:3000/member/updatepw
router.put('/updatepw', auth.checkToken, async function(req, res, next) {
    try {
      const sessionID = req.body.USERID; // 토큰에서 추출

      // 기존 암호 hash
      const hashPw = crypto.createHmac('sha256', sessionID)
          .update(req.body.pw).digest('hex');
      const query = {_id : sessionID, password:hashPw};

      // findOne으로 로그인 한 후 변경하기
      const Member1 = await Member.findOne(query);

      // 새로운 암호 hash
      const hashPw1 = crypto.createHmac('sha256', sessionID)
          .update(req.body.newpw).digest('hex');
      Member1.password  = hashPw1;

      const result = await Member1.save();
      if (result._id !== '') {
          return res.send({status:200});            
      }
      return res.send({status:0});
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});


// 회원탈퇴 (로그인, 토큰 유)
// http://127.0.0.1:3000/member/delete
router.delete('/delete', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;
        const query = {_id : sessionID};

        const result = await Member.deleteOne(query);
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


// 등록
// http://127.0.0.1:3000/member/insert
// {"id":"b1", "name":"세", "pw":"b1", "email":"b1@com", "age":77}
router.post('/insert', async function(req, res, next) {
    try {
      
        // 같은 a일 경우 똑같으니까 첨가물을 넣어야한다.
        const hashPw = crypto.createHmac('sha256', req.body.id)
            .update(req.body.pw).digest('hex'); // 16진수로 바꿈

        // 빈 Member 객체 생성
        var member = new Member();
        member._id = req.body.id;
        // =member['_id']
        member.name = req.body.name;
        member.password = hashPw;
        member.email = req.body.email;
        member.age = Number(req.body.age);
        
        // Member.save
        // model로 만들어져있기 때문에 save 가능
        const result = await member.save();
        console.log(result);

        if(result._id !== ''){
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
        const obj = await Member.findOne({_id:req.body.id});

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
// router.delete('/delete', async function(req, res, next) {
//     try {
//         const id = req.body._id;
//         const result = await Member.deleteOne({_id:id});
//         console.log(result);
//         if(result.deletedCount===1) {
//             return res.json({status:200, result:result});
//         }
//         return res.json({status:0});

//     }
//     catch(e) {
//       console.error(e);
//       return res.json({status:-1});
//     }
// });

// 아이디 중복확인
// http://127.0.0.1:3000/member/idcheck?id=a
router.get('/idcheck', async function(req, res, next) {
    try {
        // 아이디에 해당하는 값을 조회
        const result = await Member.findOne({_id:req.query.id});
        console.log(result);
        if(result !== null){
          return res.send({status:200, result:1})
        }
        return res.send({status:200, result:0});

    }catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});

// 로그인
// http://127.0.0.1:3000/member/select
// 암호가 있기 때문에 get보다는 post
// {"id":"a", "pw":"a"}
router.post('/select', async function(req, res, next) {
    try {
        // 백엔드와 연동이 되는 key
        // get => req.query.key
        // post => req.body.key

        const hashPw = crypto.createHmac('sha256', req.body.id)
            .update(req.body.pw).digest('hex'); 

        // DB와 연동되는 키(_id, password), 몽고DB와 키를 맞춰야한다.
        const query = {$and : [{_id:req.body.id, password:hashPw}]};
        const result = await Member.findOne(query);
        console.log(result);
        if(result !== null){ //성공
            // 세션에 정보를 추가함.
            // 같은 서버가 아니기 때문에 세션을 확인할 방법이 없다.
            // => 따라서 토큰을 발행(출입할 수 있는 키를 부여)
            // 토큰은 뷰에서 세션에서 정보를 읽을 수 있는 키가 된다.

            // 세션에 추가할 값, 보안키, 옵션
            const sessionData = {
                USERID : result._id,
                USERNAME : result.name
            };

            // 토큰 발행
            const token 
                = jwt.sign( sessionData, auth.securityKEY, auth.options )

            // DB에서 token이라는 키로 수정함.
            return res.send({status:200, result:token});
          }
          // 실패
          return res.send({status:0})

    }catch(e) {
      console.error(e);
      return res.send({status:-1});
    }
});





module.exports = router;