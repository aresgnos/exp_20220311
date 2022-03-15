var express = require('express');
var router = express.Router();

const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, 
    { path:'/socket', cors : {origins:'*:*'} });

// 클라이언트가 접속했을때 수행됨.
io.on('connection', (socket) => {
    console.log("---------------------");
    console.log(socket.id);

    // 클라이언트에서 메시지가 도착했을때
    socket.on('publish', function(data){
        console.log(data);

        // 모든 클라이언트에 메시지를 전송함.
        io.emit('subscribe', {
            userid : data.data.userid,
            username : data.data.username
        });
    });
});

httpServer.listen(3001, ()=>{
    console.log('http://127.0.0.1:3001/socket');
});

module.exports = router;
