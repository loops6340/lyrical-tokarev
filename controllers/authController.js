
const isAdmin = (req, res, next) => {
    const {pass} = req.cookies
    if(pass === process.env.ADMIN_PASS) return next()
    return res.redirect('https://taringa.net')
}

module.exports = {isAdmin}