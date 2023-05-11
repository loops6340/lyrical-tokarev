const RSS = require('rss');
const ArticlesServices = require('../articles/articles.services');
const articlesServices = new ArticlesServices()

module.exports = class RssService{
    constructor(){
        this.title = 'Lyrical Tokarev - Kill Them All',
        this.description = 'With Righteous Anger In Our Hearts',
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
        let image_url = 'https://lyricaltokarev.fun/public/images/pngs/al_magus.png'

        let feed =  new RSS({
            ...this,
            image_url
        })

        const articles = await articlesServices.getAllArticles()

        articles.forEach(a => {
            const {title, description, createdAt, url, thumbnail_url, thumbnail_size, thumbnail_type, categories} = a
            feed.item({
                title,
                description,
                url: `https://lyricaltokarev.fun/blog/writings/${url}`,
                author: `Gor`,
                date: createdAt.toUTCString(),
                lat: '-30.845200317505412',
                long: '-64.4769029017211',
                categories,
                enclosure: {
                    url: thumbnail_url,
                    size: thumbnail_size,
                    type: thumbnail_type
                }
            }
        );
        })



        return feed.xml({indent: true})
    }

}
