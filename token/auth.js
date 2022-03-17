const { verify } = require('jsonwebtoken');
const { sign } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

// module.exports = { } 이렇게 만들어지는 것은 외부에서 쓸 수 있다.

const self = module.exports = {
    // 토큰 발행 salt값
    securityKEY : 'fdfdfffffdd!@#dd',

    // 토큰 발행에 필요한 옵션들
    options : {
        algorithm : 'HS256',
        expiresIn : '10h', // 10시간
        issuer : 'ds'
    },

    // 프론트엔드에서 오는 토큰 검증 부분 (토큰의 유효성 검사)
    checkToken : async(req, res, next) => {
        try{
            const token = req.headers.auth; // key = auth, 토큰은 headers로 와야함.
            if(token === null) {
                return res.send({status:0, result:'토큰없음'});
            }

            // 발행시 sign <=> verify 검증시
            // 발행된 토큰, 보안키(셀프 밑에 securityKEY)
            // 토큰 검증하는 부분(토큰을 복원할 때)
            const sessionData = jwt.verify(token, self.securityKEY);

            // USERID, USERNAME 이라는 키가 존재하는지 확인
            if(typeof sessionData.USERID === 'undefined'){
                return res.send({status:0, result:'토큰복원실패'});
            }

            if(typeof sessionData.USERNAME === 'undefined'){
                return res.send({status:0, result:'토큰복원실패'});
            }

            // routes/member.js에서 사용 가능하도록 정보 전달
            req.body.USERID = sessionData.USERID;
            req.body.USERNAME = sessionData.USERNAME;

            next(); // routes/member.js 동작, next가 있어야 동작이 된다.
        }
        catch(e) {
            console.error(e.message);
            if(e.message === 'invalid signature'){
                return res.send({status:0, result:'인정실패'});
            }
            else if(e.message === 'jwt expired'){
                return res.send({status:0, result:'시간만료'});
            }
            else if(e.message === 'invalid token'){
                return res.send({status:0, result:'유효하지 않는 토큰'});
            }
            return res.send({status:0, result:'유효하지 않는 토큰'});
        }
    }
}