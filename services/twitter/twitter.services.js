const Twitter = require('twitter')
require('dotenv').config()
const { convert } = require('html-to-text');
const axios = require('axios');
const { initializeMediaUpload, appendFileChunk, finalizeUpload } = require('./gifUpload');

class TwitterServices{
    constructor(){
        this.twitterClient = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });
    }

    async tweetArticle(data, thumbnail_url){
        try{
        const srcs = getImgSrcFromHTML(data)
        const images = srcs.filter(i => {return i.match(/\.[0-9a-z]+$/i)[0] !== '.gif'})
        const gifs = srcs.filter(i => {return i.match(/\.[0-9a-z]+$/i)[0] === '.gif'})
        const tweet = convert(data, {selectors: [ { selector: 'img', format: 'skip' }, { selector: 'a', format: 'skip' } ]})
        const tweetSplitArr = (tweet.match(/.{1,280}/g));

        const media_id_string = await twitterUploadMedia(thumbnail_url, this.twitterClient)

        
        const firstTwElement = tweetSplitArr.shift()
        const parentTweetPostReqData = await this.twitterClient.post('https://api.twitter.com/1.1/statuses/update.json', {status: firstTwElement, media_ids: media_id_string})
        const parentId = parentTweetPostReqData.id_str

        let idToReply = parentId

        while(tweetSplitArr.length > 0){
            const twElement = tweetSplitArr.shift()
            const tweetReplyResData = await this.twitterClient.post('https://api.twitter.com/1.1/statuses/update.json', {status: twElement, in_reply_to_status_id: idToReply})
            idToReply = tweetReplyResData.id_str
        }

        if(images.length > 0){

            let uploadedImages = []

            while(images.length > 0){
                const imageToUpload = images.shift()
                const mediaIdString = await twitterUploadMedia(imageToUpload, this.twitterClient)
                uploadedImages.push(mediaIdString)
            }

            let imagesToSend = []
            for (let i = 1; i <= uploadedImages.length+1; i++) {
                const imageTwitterId = uploadedImages[i-1];
                imagesToSend.push(imageTwitterId)
                if(i % 4 === 0 || i-1 === uploadedImages.length){
                    const joined = imagesToSend.join(',')
                    const tweetReplyResData = await this.twitterClient.post('https://api.twitter.com/1.1/statuses/update.json', {
                        in_reply_to_status_id: idToReply,
                        media_ids: joined,
                        status: ""
                    })
                    idToReply = tweetReplyResData.id_str
                    imagesToSend = []
                }
            }

            while(gifs.length > 0){
                console.log(gifs)
                const gif = gifs.shift()
                try{
                    const base64AndLength  = await getBase64(gif, {gif: true})
                    const initId = await initializeMediaUpload(this.twitterClient, base64AndLength.length)
                    await appendFileChunk(this.twitterClient, initId, base64AndLength.base64)
                    await finalizeUpload(this.twitterClient, initId)
                    const tweetReplyResData = await this.twitterClient.post('https://api.twitter.com/1.1/statuses/update.json', {status: "", in_reply_to_status_id: idToReply, media_ids: initId})
                    idToReply = tweetReplyResData.id_str
                    }catch(e){
                        console.error(e)
                    }
            }

        }

        return{
            success: true,
            data: parentId
        }
        }catch(e){
            console.log(e)
            return {
                success: false,
                data: e.message
            }
        }
    }

}

function getImgSrcFromHTML(html){
    const images = []
    const rex =  /<img[^>]+src="?([^"\s]+)"?\s*/gi;
    while (m = rex.exec( html )) {
        images.push( m[1] );
    }
    return images
}

async function getBase64(url, options = {gif: false}) {

    const resBuffer = await (await axios.get(url, {responseType: 'arraybuffer'}))
    const base64 = Buffer.from(resBuffer.data, 'binary').toString('base64')
    if(options.gif){
        return {base64, length: resBuffer.headers['content-length']}
    }
    return base64
  }

async function twitterUploadMedia(url, client, options = {media_category: 'tweet_image'}){
    const {media_category} = options
    try{
    const media_data = await getBase64(url)
    const uploadedImageRes = await client.post(`https://upload.twitter.com/1.1/media/upload.json?media_category=${media_category}`, {media_data})
    return uploadedImageRes.media_id_string
    }catch(e){
        console.error(e)
    }
}



module.exports = TwitterServices