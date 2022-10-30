
const cloudinary = require('cloudinary')
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME, // add your cloud_name
        api_key: process.env.CLOUDINARY_KEY, // add your api_key
        api_secret: process.env.CLOUDINARY_SECRET, // add your api_secret
        secure: true
       });
module.exports = cloudinary