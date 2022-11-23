const {Router} = require('express');
const router = Router();

const requestIp = require('request-ip');
const shuffle = require("../../utils/shuffle");
const {Visitor} = require('../../db/db');
const axios = require('axios')

router.get("/", async (req, res) => {
    let {indexBarGifs} = req.app.locals
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

module.exports = router;