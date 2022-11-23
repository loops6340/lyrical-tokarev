const RSS = require('rss');
const axios = require('axios')

module.exports = class RssService{
    constructor(){
        this.title = 'Lyrical Tokarev - Kill Them All',
        this.description = 'With Righteous Anger In Our Heart',
        this.feed_url = 'https://lyricaltokarev.fun/blog/rss',
        this.site_url = 'https://lyricaltokarev.fun',
        this.categories = ['Jesus', 'Justice', 'Redemption']
        this.language = 'en',
        this.ttl = '60'
        this.managingEditor = 'god@aol.com',
        this.webMaster = 'gor@gordasgaming.com',
        this.pubDate = (new Date).toUTCString()
    }

    async createRss(){
        let image_url = 'https://lyricaltokarev.fun/public/images/Sin%20t%C3%ADtulo-8.png'

        let feed =  new RSS({
            ...this,
            image_url
        })

        const thumbnail = 'https://img1.ak.crunchyroll.com/i/spire1/6c3852c71e6a68c43a47409331b627f81642825856_large.jpg'
        const imageDataRes = await axios.get(thumbnail)

        feed.item({
            title:  'item title',
            description: 'ESTE ES EL FIN DE TODA LA ESPERANZA DE PERDER AL hijo LA FE <img src="https://img1.ak.crunchyroll.com/i/spire1/6c3852c71e6a68c43a47409331b627f81642825856_large.jpg">',
            url: 'https://lyricaltokarev.fun/blog/articles/artId',
            author: 'Gor',
            date: (new Date).toUTCString(),
            lat: '-30.845200317505412',
            long: '-64.4769029017211',
            enclosure: {
                url: thumbnail,
                size: imageDataRes.headers['content-length'],
                type: imageDataRes.headers['content-type']
            }
        }
    );

    feed.item(        {
        title:  'El pollon cebollon',
        description: 'SUSANA XD',
        url: 'https://lyricaltokarev.fun/blog/articles/artId',
        author: 'Gor',
        date: (new Date).toUTCString(),
        lat: '-30.845200317505412',
        long: '-64.4769029017211',
        enclosure: {
            url: thumbnail,
            size: imageDataRes.headers['content-length'],
            type: imageDataRes.headers['content-type']
        }
    })

        return feed.xml({indent: true})
    }

}