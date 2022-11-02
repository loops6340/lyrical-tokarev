require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const requestIp = require('request-ip');
const cloudReq = require('./utils/cloudinary/cloudReq');
const shuffle = require("./utils/shuffle");
const {conn, Visitor} = require('./db/db');
const axios = require('axios')

conn.sync()

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

cloudReq(app)
setInterval(async () => await cloudReq(app), 300000)

app.get("/", async (req, res) => {
  let {indexBarGifs} = app.locals
  if(indexBarGifs){
    indexBarGifs = shuffle(indexBarGifs)
  }

  const ip = requestIp.getClientIp(req)

  const visitor = await Visitor.findOne({where: {
    ip: ip
  }})

  if(!visitor){
    try{
      const geoReq = await axios.get(`https://api.findip.net/${ip}/?token=${process.env.GEO_TOKEN}`)
      const country = geoReq.data ? geoReq.data.country.names.en.toLowerCase() : 'loquendo_city'
      await Visitor.create({ip, country})
      console.log('New visitor from ' + country)
    }catch(e){
      console.log(e.message)
    }
  }



  const visitorCount = await Visitor.count()

  res.render("index", ({indexBarGifs, visitorCount}));

});



app.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});