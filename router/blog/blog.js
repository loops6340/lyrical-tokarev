const {Router} = require('express');
const router = Router();

router.get('/ping', async (req, res) => {

    try{
        res.send('pong')
    }catch(e){
        next(e);
    };

});

module.exports = router;