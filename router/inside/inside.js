const { Router } = require("express");
const router = Router();

router.get('/arcadia', (req, res) => {
    res.render('inside/arcadia')
})

module.exports = router