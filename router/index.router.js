const {Router} = require('express');
const router = Router();

const index = require('./index/index')
const guestbook = require('./guestbook/guestbook')
const blog = require('./blog/blog.router')
const login = require('./login/login')
const chat = require('./chat/chat')
const inside = require('./inside/inside')

router.use('/', index)
.use('/guestbook', guestbook)
.use('/blog', blog)
.use('/login', login)
.use('/chat', chat)
.use('/inside', inside)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;