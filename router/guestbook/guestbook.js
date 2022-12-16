const {Router} = require('express');
const router = Router();
const {Visitor, Guestbook_comment} = require('../../db/db');
const requestIp = require('request-ip');
const axios = require('axios');
const validateEmail = require('../../utils/validateEmail');
const FilterService = require('../../services/filter/filter.services');
const ResourcesService = require('../../services/resources/resources.services');
const filter = new FilterService()
const resourceService = new ResourcesService()

router.get('/', async (_req, res) => {
    let pics = await (await resourceService.getAvatars()).data
    const comments = await (await Guestbook_comment.findAll({include: Visitor})).map(c => {
    const obj = {...c}
    obj.dataValues.pic = pics.find(p => p.filename === obj.dataValues.pic).url
    return obj.dataValues
    })
    return res.render('guestbook', {comments})
})

router.post('/', async (req, res) => {
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
    let pics = await (await resourceService.getAvatars()).data
    pic = pics[Math.floor(Math.random()*pics.length)].filename
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

module.exports = router;