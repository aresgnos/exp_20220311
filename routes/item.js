var express = require('express');
var router = express.Router();

// model, import
var Item = require('../models/item');

// app.js에 item url 등록

// 물품 등록
// http://127.0.0.1:3000/item/insert
// post는 body에
// {"code1":"101", "code2":"001", "code3":"011", "name":"아이폰", "price":1000, "quantity":2 }
router.post('/insert', async function(req, res, next) {
    try {
        // 빈 객체 만들기
        var item = new Item();

        item.code1 = req.body.code1;
        item.code2 = req.body.code2;
        item.code3 = req.body.code3;
        item.name = req.body.name;
        item.price = Number(req.body.price);
        item['quantity'] = Number(req.body.quantity);

        const result = await item.save();
        console.log(result);

        if(result._id !== ''){
            return res.json({status:200});
        }
        return res.json({status:0});

    }catch(e){
        console.log(e)
        res.send({status:-1});
    }
});

// 물품 목록
// http://127.0.0.1:3000/item/select
router.get('/select', async function(req, res, next) {
    try {
        // 전체 조회이기 때문에 query는 비어있음
        const query = {};
        const result = await Item.find(query).sort({"_id":-1});
        res.send({status:200, result:result});
    
    }catch(e){
        console.log(e)
        res.send({status:-1});
    }
});

// 대분류별 등록물품 개수
// http://127.0.0.1:3000/item/groupcode1
router.get('/groupcode1', async function(req, res, next) {
    try {
        const query = {};
        const result = await Item.aggregate([
            {
                $project : {
                    code1 : 1,
                    price : 1,
                    quantity : 1
                }
            },
            {
                $group : {
                    _id : '$code1', // 그룹하는 기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }
        ]).sort({"_id":1}); // 코드 기준 오름차순

        res.send({status:200, result:result});

    }catch(e){
        console.log(e)
        res.send({status:-1});
    }
});

// 중분류별 등록물품 개수
// http://127.0.0.1:3000/item/groupcode2
router.get('/groupcode2', async function(req, res, next) {
    try {
        const query = {};
        const result = await Item.aggregate([
            
            {
                $project : {
                    code2 : 1,
                    price : 1,
                    quantity : 1
                }
            },
            {
                $group : {
                    _id : '$code2', //그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum :'$quantity'}
                }
            }
        ]);

        res.send({status:200, result:result});
    }
    catch(e){
        console.error(e);
        res.send({status:-1});
    }
});

// 소분류별 등록물품 개수
// http://127.0.0.1:3000/item/groupcode3
router.get('/groupcode3', async function(req, res, next) {
    try {
        const query = {};
        const result = await Item.aggregate([
            
            {
                $project : {
                    code3 : 1,
                    price : 1,
                    quantity : 1
                }
            },
            {
                $group : {
                    _id : '$code3', //그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum :'$quantity'}
                }
            }
        ]);

        res.send({status:200, result:result});
    }
    catch(e){
        console.error(e);
        res.send({status:-1});
    }
});

// 중분류 코드별 물품 개수
// http://127.0.0.1:3000/item/code2?code=011
router.get('/code2', async function(req, res, next) {
    try {
        const code2 = req.query.code;
        const result = await Item.aggregate([
            {
                $match : {
                    code2 : code2
                }
            }, 
            {
                $project : {
                    code2 : 1,
                    price : 1,
                    quantity : 1
                }
            },
            {
                $group : {
                    _id : '$code2', //그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum :'$quantity'}
                }
            }
        ]);

        res.send({status:200, result:result});
    }
    catch(e){
        console.error(e);
        res.send({status:-1});
    }
});

// 소분류별 등록물품 개수
// http://127.0.0.1:3000/item/code3?code=011
router.get('/code3', async function(req, res, next) {
    try {
        const code3 = req.query.code;
        const result = await Item.aggregate([
            {
                $match : {
                    code3 : code3
                }
            }, 
            {
                $project : {
                    code3 : 1,
                    price : 1,
                    quantity : 1
                }
            },
            {
                $group : {
                    _id : '$code3', //그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum :'$quantity'}
                }
            }
        ]);

        res.send({status:200, result:result});
    }
    catch(e){
        console.error(e);
        res.send({status:-1});
    }
});



module.exports = router;
