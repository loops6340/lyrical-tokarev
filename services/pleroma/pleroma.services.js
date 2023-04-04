require('dotenv').config()
const generator = require('megalodon');
const { convert } = require('html-to-text');

const BASE_URL = process.env.MEGALODON_BASE_URL
const ACCESS_TOKEN = process.env.MEGALODON_ACCESS_TOKEN

class PleromaService{
    constructor(){
        this.client = generator.default('pleroma', BASE_URL, ACCESS_TOKEN)
    }

    
    async post(content, in_reply_to_id = null, visibility = "public"){
        try{
        const res = await this.client.postStatus(content, {visibility, in_reply_to_id})
        return{
            success: true,
            data: res.data
        }
        }catch(e){
            console.error(e)
            return{
                success: false,
                data: e.message
            }
        }
    }

    async pleromaArticleMirror(data, visibility = null){
        try{
        const status = convert(data, {selectors: [ { selector: 'img', format: 'skip' }, { selector: 'a', format: 'skip' } ], wordwrap: 4999})
        const statusSplit = (status.match(/.{1,4999}/g));
        const firstStatus = (await this.post(statusSplit.shift(), null, visibility)).data

        let currentId = firstStatus.id

        for(let newStatus of statusSplit){
            const res = await (await this.post(newStatus, currentId, visibility)).data
            currentId = res.id
        }
        return{
            success: true,
            data: firstStatus.id
        }
    }catch(e){
        console.error(e)
        return{
            success: false,
            data: e.message
        }
    }
    }

}

module.exports = PleromaService;