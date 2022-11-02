require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const cloudReq = require('./utils/cloudinary/cloudReq');
const shuffle = require("./utils/shuffle");

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

cloudReq(app)
setInterval(async () => await cloudReq(app), 300000)

app.get("/", (req, res) => {
  let {indexBarGifs} = app.locals
  const requestIp = require('request-ip');
  console.log(requestIp.getClientIp(req))


  if(indexBarGifs){
    indexBarGifs = shuffle(indexBarGifs)
  }
  res.render("index", ({indexBarGifs}));
});



app.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});