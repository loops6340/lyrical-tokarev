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

app.get("/", (_req, res) => {
  let {indexBarGifs} = app.locals
  if(indexBarGifs){
    indexBarGifs = shuffle(indexBarGifs)
  }
  res.render("index", ({indexBarGifs}));
});



app.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});