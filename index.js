// File: websocket/ws-server.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
    console.log('🟢 Client WebSocket đã kết nối');

    ws.on('message', function incoming(message) {
        console.log('📨 Tin nhắn nhận được:', message);

        // Broadcast lại tin nhắn đến tất cả clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('🔌 Client WebSocket đã ngắt kết nối');
    });
});
