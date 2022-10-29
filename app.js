require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (_req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})