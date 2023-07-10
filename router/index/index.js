const {Router} = require('express');
const router = Router();
const requestIp = require('request-ip');
const shuffle = require("../../utils/shuffle");
const {Visitor} = require('../../db/db');
const axios = require('axios');
const ResourcesService = require('../../services/resources/resources.services');
const resourcesService = new ResourcesService()

router.get("/", async (req, res) => {

    const indexBarGifsNoShuffle = await (await resourcesService.getAllGifs()).data
    const indexBarGifs = shuffle(indexBarGifsNoShuffle).filter(g => g.width <= 70 && g.height <= 70)

    const shillButtons = shuffle( await (await resourcesService.getAllButtonsAndBannersAndOrderByTag(['button', 'shill'])).data)

    const buttons = shuffle( await (await resourcesService.getAllButtonsAndBannersAndOrderByTag(['button'], ['shill', 'ring'])).data)

    const mutuals = shuffle( await (await resourcesService.getAllButtonsAndBannersAndOrderByTag(['button', 'ring'])).data)

    const ads = shuffle( await (await resourcesService.getAllButtonsAndBannersAndOrderByTag(['ad'])).data).filter(a => {
      return a.width > 200 && a.width < 500 && a.height < 500 && a.height < 500
    })
  
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
    
      res.render("index", ({indexBarGifs, visitorCount, shillButtons, buttons, ads, mutuals}));
    
});

module.exports = router;