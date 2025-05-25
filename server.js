const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

let isAdminOnline = false;

io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('admin_connected', () => {
        isAdminOnline = true;
        console.log('✅ Admin đang online');
        io.emit('admin_status', 'online');
    });

    socket.on('user_connected', (userId) => {
        console.log(`👤 Khách hàng ${userId} đã online`);
        socket.emit('admin_status', isAdminOnline ? 'online' : 'offline');
    });

    socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`🔗 Client ${socket.id} tham gia conversation_${conversationId}`);
    });

    socket.on('send_message', (data) => {
        console.log('📩 Message received:', data);
        io.to(`conversation_${data.conversation_id}`).emit('receive_message', data);
    });

    socket.on('typing', (data) => {
        socket.to(`conversation_${data.conversation_id}`).emit('typing', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
        if (io.sockets.sockets.size === 0) {
            isAdminOnline = false;
            io.emit('admin_status', 'offline');
        }
    });
});

server.listen(3000, () => {
    console.log('✅ WebSocket server running at http://localhost:3000');
});