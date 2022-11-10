require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const requestIp = require('request-ip');
const fs = require('fs')
const cloudReq = require('./utils/cloudinary/cloudReq');
const shuffle = require("./utils/shuffle");
const {conn, Visitor, Guestbook_comment} = require('./db/db');
const axios = require('axios')
const cors = require('cors');

conn.sync({force: process.env.FORCE === 'true' ? true : false})
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: 'https://lyricaltokarev.neocities.org'
}));

cloudReq(app)
setInterval(async () => await cloudReq(app), 300000)


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


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

app.get('/guestbook', async (_req, res) => {

  const comments = await Guestbook_comment.findAll({include: Visitor})
  return res.render('guestbook', {comments})
})

app.post('/guestbook', async (req, res) => {
  let {name, website, email, message, member, pic} = req.body
  try{
  if(!member || member === " ") return res.send('YOU HAVE TO TURN AT LEAST ONE MEMBER OF YOUR FAMILY INTO A MINION (DESPICABLE ME)')
  if(!message || message.length === " ") return res.send('MESSAGE CANT BE EMPTY!!!!!!!!')
  if(!name) name = 'anon'
  if(!validateEmail(email)) email = null
  const ip = requestIp.getClientIp(req)
  const visitor = await Visitor.findOne({where: {
    ip: ip
  }})
  if(!visitor) return res.redirect('https://lyricaltokarev.neocities.org')
  try{
  const webCheckReq = await axios.get(website)
  if(!webCheckReq.headers['content-type'].split(';')[0] === 'text/html') website = null
  }catch(e){
    website = null
    console.log(e)
  }

  if(!pic){
    let pics = fs.readdirSync('./public/images/avatar')
    pic = pics[Math.floor(Math.random()*pics.length)]
  }

  await Guestbook_comment.create({
    name,
    website, 
    email,
    message,
    member,
    pic, 
    visitorId: visitor.dataValues.id})

    return res.redirect('/guestbook')

  }catch(e){
    console.log(e)
    return res.send(e.message)
  }
  })


app.get('/door', (_req, res) => {

  let bgs = []

  fs.readdir('./public/images/backgrounds/door', (err, files) =>{
    if(err){
      console.log(err)
      files = ['ayana2']
    }
    bgs = files
    res.status(200).send({bgs})
  })
})

app.get('/avatar', (_req, res) => {

  let bgs = []

  fs.readdir('./public/images/avatar', (err, files) =>{
    if(err){
      console.log(err)
      files = ['59.jpeg']
    }
    bgs = files
    res.status(200).send({bgs})
  })
})



app.listen(port, () => {
  console.log(`リリカルとカレブ！きるぜむおおる！！！！ ${port}`);
});