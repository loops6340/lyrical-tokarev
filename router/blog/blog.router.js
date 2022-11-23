const {Router} = require('express');
const router = Router();

const rss = require('./rss/rss')
const blog = require('./blog')

router.use('/', blog)
router.use('/rss', rss)

module.exports = router;