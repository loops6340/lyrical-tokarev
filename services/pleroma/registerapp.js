require('dotenv').config()
const generator = require('megalodon')
const BASE_URL = process.env.MEGALODON_BASE_URL
const client = generator.default('pleroma', BASE_URL)

client.registerApp('Multi', {scopes: null})
  .then(appData => {
    console.log("MEGALODON_CLIENT_ID", appData.clientId)
    console.log("MEGALODON_CLIENT_SECRET", appData.clientSecret)
    console.log('GET YOUR TOKEN BELOW')
    console.log(appData.url)
  })

