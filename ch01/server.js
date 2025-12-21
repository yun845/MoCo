const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 讓伺服器可以讀取同資料夾下的 HTML 檔案
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('連線成功');
    
    // 監聽 sos 頻道
    socket.on('sos', (data) => {
        // 加上伺服器收到的時間
        data.serverTime = new Date().toLocaleTimeString();
        // 廣播給所有人
        io.emit('receive_sos', data);
    });
});

http.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
