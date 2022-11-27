const express = require('express')
const router = express.Router()

router.get('/:pass', async(req, res) => {
    res.cookie('pass', req.params.pass, {httpOnly: true, expires: new Date(253402300000000)})
    res.redirect('/')
})

module.exports = router