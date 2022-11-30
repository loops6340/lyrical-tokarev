const axios = require('axios')
const {Article, Category} = require('../../db/db')
const TwitterServices = require('../twitter/twitter.services')
const twitterService = new TwitterServices()
const FilterService = require('../../services/filter/filter.services');
const filter = new FilterService()


module.exports = class ArticlesServices{
    constructor(){
        this.paginated = 20
    }

    async createArticle(data){
        try{
            let {title, description, thumbnail_url} = data
            const imageDataRes = await axios.get(thumbnail_url)
            
            const thumbnail_size = imageDataRes.headers['content-length']
            const thumbnail_type = imageDataRes.headers['content-type']

            const url = data.title.toLowerCase().split(' ').join('-')

            Object.assign(data, {
                thumbnail_size,
                thumbnail_type,
                url,
            })

            data.title = filter.filter(title)
            data.description = filter.filter(description)


            if(data.tweet){
                try{
                const tweet_id = await (await twitterService.tweetArticle(`${title}: ${description}`, thumbnail_url)).data
                Object.assign(data, {
                    tweet_id
                })
                }catch(e){
                    console.error(e)
                }
            }



            const article = await Article.create(data)

            for(const category of data.categories){
                const cat = await (await Category.findOrCreate({where: {name: category}}))[0]
                await article.addCategory(cat)
            }

            return {
                success: true,
                data: article
            }

        }catch(e){
            console.error(e)
            return {
                success: false,
                data: e.message
            }
        }
    }

    async getAllArticles(page = 0, categories = [], returnCount = false){

        let unmappedArticles = {}

        const query = {include: {model: Category}, limit: this.paginated, offset: page*this.paginated, order: [['createdAt', 'DESC']]}

        if(categories.length){
            for(const name of categories){
                query.include.where = {name}
                let foundArticles = await Article.findAndCountAll(query)
                const {rows, count} = foundArticles
                unmappedArticles = {count, rows: unmappedArticles.rows ? [...unmappedArticles.rows, ...rows] : rows}
            }
        }
        else unmappedArticles = await Article.findAndCountAll(query)
        const {rows, count} = unmappedArticles
        const articles = rows.map(i => {
            return {
                ...i.dataValues,
                categories: i.dataValues.categories.map(i => {return i.dataValues.name})
            }
        })
        if(returnCount) return {articles, count}
        return articles
    
    }

    async getArticleByUrl(url){
        const article = await Article.findOne({where: {url}, include: {model: Category}})
        return article
    }

}