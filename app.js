require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const cloudReq = require('./utils/cloudinary/cloudReq');
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

cloudReq(app)
setInterval(async () => await cloudReq(app), 300000)

app.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});

module.exports = app