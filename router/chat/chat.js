const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    try{
        res.render('chat')
    }catch(e){
        console.error(e)
        return res.json({
            error: e.message
        })
    }
})

module.exports = router;