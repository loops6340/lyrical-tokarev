const {Router} = require('express');
const router = Router();

const index = require('./index/index')
const guestbook = require('./guestbook/guestbook')
const blog = require('./blog/blog.router')
const login = require('./login/login')
const fs = require('fs')

router.use('/', index)
router.use('/guestbook', guestbook)
router.use('/blog', blog)
router.use('/login', login)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/door', (_req, res) => {

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

router.get('/avatar', (_req, res) => {

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



module.exports = router;