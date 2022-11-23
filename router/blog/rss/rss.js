const {Router} = require('express');
const router = Router();

const RssService = require('../../../services/rss/rss.services')
const rssService = new RssService()

router.get('/', async (req, res) => {
  const rss = await rssService.createRss()
  res.set('Content-Type', 'text/xml');
  res.send(rss)
})
module.exports = router;