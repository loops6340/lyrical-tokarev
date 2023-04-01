require('dotenv').config()
const generator = require('megalodon');

const BASE_URL = process.env.MEGALODON_BASE_URL
const ACCESS_TOKEN = process.env.MEGALODON_ACCESS_TOKEN

class PleromaService{
    constructor(){
        this.client = generator.default('pleroma', BASE_URL, ACCESS_TOKEN)
    }

    
    async post(content, visibility = "public"){
        try{
        const res = await this.client.postStatus(content, {visibility})
        console.log(res.data)
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

}

new PleromaService().post("nigger", "private")