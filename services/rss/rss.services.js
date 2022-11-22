const RSS = require('rss');

module.exports = class RssService{
    constructor(){
        this.title = 'Lyrical Tokarev - Kill Them All',
        this.description = 'With Righteous Anger In Our Heart',
        // this.author = 'Gor',
        this.feed_url = 'https://lyricaltokarev.fun/blog/rss',
        this.site_url = 'https://lyricaltokarev.fun',
        this.categories = ['Jesus', 'Justice', 'Redemption']
        this.language = 'en',
        this.ttl = '60'
    }

    async createRss(req){
        let {indexBarGifs} = req.app.locals
        let image_url
        try{
        if(indexBarGifs) image_url = indexBarGifs[Math.floor(Math.random()*indexBarGifs.length)].url;
        else image_url = ''
        }catch(e){
            console.error(e)
            image_url = ''
        }


        let feed =  new RSS({
            ...this,
            image_url
        })
        feed.item({
            title:  'item title',
            description: 'use this for the content. It can include html.',
            url: 'http://localhost:3003/public/test.html'
        });

        return feed.xml()
    }

}