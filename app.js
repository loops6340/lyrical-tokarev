require("dotenv").config();
const express = require("express");
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const port = process.env.PORT;
const path = require("path");
const {conn} = require('./db/db');
const cookieParser = require('cookie-parser')

const cors = require('cors');
const router = require('./router/index.router')

conn.sync({force: process.env.FORCE === 'true' ? true : false})
app.use(express.urlencoded({extended: true}))
app.use(express.json({limit : '50mb'}))
app.use(cookieParser());

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: 'https://lyricaltokarev.neocities.org'
}));
app.use('/', router)

httpServer.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});

const messages = []

io.on('connection', (socket) => {

  const clientIp = socket.request.connection.remoteAddress;

  messages.forEach(m => {
    socket.emit('SEND_MESSAGE_FROM_SERVER', m)
  })

  socket.on('SEND_MESSAGE_TO_SERVER', (message) => {
    console.log(clientIp, message.text, message.author)
    messages.push(message)
    io.emit('SEND_MESSAGE_FROM_SERVER', message)
    if(messages.length > 50){
      messages.shift()
    }
  })


})

module.exports = app