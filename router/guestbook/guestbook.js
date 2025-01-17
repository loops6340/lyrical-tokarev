const {Router} = require('express');
const router = Router();
const {Visitor, Guestbook_comment} = require('../../db/db');
const requestIp = require('request-ip');
const axios = require('axios');
const validateEmail = require('../../utils/validateEmail');
const FilterService = require('../../services/filter/filter.services');
const ResourcesService = require('../../services/resources/resources.services');
const { isAdmin } = require('../../controllers/authController');
const { Op } = require('sequelize');
const filter = new FilterService()
const resourceService = new ResourcesService()

router.get('/', async (req, res) => {
    const {pass} = req.cookies
    let admin = false
    let pics = await (await resourceService.getAvatars()).data || []
    const ads = await (await resourceService.getAllButtonsAndBannersAndOrderByTag(["ad"], [], ["banner"])).data
    const randomAd = ads.length > 0 ? ads[Math.floor(Math.random()*ads.length)] : null
    const comments = await (await Guestbook_comment.findAll({include: Visitor, order: [['id', 'DESC']]})).map(c => {
    const obj = {...c}
    obj.dataValues.pic = pics.length > 0 ? pics.find(p => p.filename === obj.dataValues.pic).url : '/public/images/portraits/alicedefeat.png'
    return obj.dataValues
    })
    if(pass === process.env.ADMIN_PASS) admin = true
    return res.render('guestbook', {comments, randomAd, admin})
})

router.post('/', async (req, res) => {
  let {name, website, email, message, member, pic} = req.body
  try{
    const ip = requestIp.getClientIp(req)
    const visitor = await Visitor.findOne({where: {
      ip: ip
    }})
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
    const commentsMade1WeekAgo = await Guestbook_comment.findAll({where:{visitorId: visitor.id, createdAt: {[Op.gte]: oneWeekAgo}}, order: [['createdAt', 'DESC']]})
    if(commentsMade1WeekAgo.length > 0){
      const comment = commentsMade1WeekAgo[0];
      const differenceInDays = Math.floor(
      7 - (currentDate - comment.createdAt) / (1000 * 60 * 60 * 24)
      );
      return res.send(`You need to wait ${differenceInDays} day${differenceInDays === 1 ? "" : "s"} to comment again.`)
    }
  if(!member || member === " ") return res.send('YOU HAVE TO TURN AT LEAST ONE MEMBER OF YOUR FAMILY INTO A MINION (DESPICABLE ME)')
  if(!message || message.length === " ") return res.send('MESSAGE CANT BE EMPTY!!!!!!!!')
  if(!name) name = 'anon'
  if(!validateEmail(email)) email = null
  if(!visitor) return res.redirect('https://lyricaltokarev.neocities.org')
  try{
  const webCheckReq = await axios.get(website)
  if(!webCheckReq.headers['content-type'].split(';')[0] === 'text/html') website = null
  }catch(e){
    website = null
    console.log(e)
  }

  if(!pic){
    let pics = await (await resourceService.getAvatars()).data
    pic = pics.length ? pics[Math.floor(Math.random()*pics.length)].filename : null
  }

  message = filter.filter(message)

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

  router.post('/reply/:id', isAdmin, (req, res) => {
    const {reply} = req.body
    if(!reply) return res.send("falta mensaje xd")
    const {id} = req.params
    Guestbook_comment.update({
      reply
    },
    {
      where: {id}
    })
    return res.redirect('/guestbook')
  })

module.exports = router;