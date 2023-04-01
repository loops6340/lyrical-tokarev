require('dotenv').config()
const generator = require('megalodon')
const BASE_URL = process.env.MEGALODON_BASE_URL
const CLIENT_ID = process.env.MEGALODON_CLIENT_ID
const CLIENT_SECRET = process.env.MEGALODON_CLIENT_SECRET
const AUTH_CODE = process.env.MEGALODON_AUTH_CODE

const client = generator.default('pleroma', BASE_URL)

client.fetchAccessToken(CLIENT_ID, CLIENT_SECRET, AUTH_CODE)
  .then((tokenData) => {
    console.log(tokenData.accessToken, "ACCESS TOKEN (THE IMPORTANT ONE)")
    console.log(tokenData.refreshToken, "<--- REFRESH TOKEN (GAY)")
  })
  .catch((err) => console.error(err))