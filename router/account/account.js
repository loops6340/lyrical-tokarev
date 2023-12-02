const express = require('express')
const router = express.Router()
const {Account} = require('../../db/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get("/register", async (req, res) => {
    res.render("account-register")
})

router.post('/register', upload.single('avatar'), async (req, res) => {
    console.log(req.body)

    const { username, password, image } = req.body;
    console.log(username,image,password)
    console.log(req.file)
    res.send("ok")

    try {
        const { username, password } = req.body;
        // Check if the email exists
        const userExists = await Account.findOne({
            where: {username}
        });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }


        await Account.create({
            username,
            password: await bcrypt.hash(password, 15),
            image: req.file.path
        });
        return res.status(200).send('Registration successful');
    } catch (err) {
        return res.status(500).send('Error in registering user');
    }
})

router.get("/login", async (req, res) => {
    res.render("account-login", {error: null})
})

router.post('/login', async (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(username, password)
        const user = await Account.findOne({
            where: {username}
        });
        if (!user) {
            return res.render("account-login", {
                error: 'User not found'
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.render("account-login", {
                error: 'Incorrect email and password combination'
            })
        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION
        });
   
        res.status(200).send({
            id: user.id,
            username: user.username,
            accessToken: token,
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send('Sign in error');
    }

})

module.exports = router