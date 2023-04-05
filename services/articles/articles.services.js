const axios = require('axios')
const {Article, Category} = require('../../db/db')
const TwitterServices = require('../twitter/twitter.services')
const twitterService = new TwitterServices()
const FilterService = require('../../services/filter/filter.services');
const PleromaService = require('../pleroma/pleroma.services');
const { convert } = require('html-to-text');
const pleromaSerivce = new PleromaService()


module.exports = class ArticlesServices{
    constructor(){
        this.paginated = 20
    }

    async createArticle(data){
        try{
            let {title, description, thumbnail_url} = data

            if(thumbnail_url){
                const imageDataRes = await axios.get(thumbnail_url)
                Object.assign(data, {
                    thumbnail_size: imageDataRes.headers['content-length'],
                    thumbnail_type: imageDataRes.headers['content-type']
                })
            }

            let url
            

            if(title.length > 0){
                url = data.title.toLowerCase().split(' ').join('-') 
            }else{
                data.title = convert(description, {selectors: [ { selector: 'img', format: 'skip' }, { selector: 'a', format: 'skip' } ]}).slice(0, 10)
                url = data.title.slice(0, 10).split(' ').join('-')
            }

            Object.assign(data, {
                url,
            })

            // data.title = filter.filter(title)
            // data.description = filter.filter(description)


            if(data.tweet){
                try{
                    const tweet_id = await (await twitterService.tweetArticle(`${title.length > 0 ? title : ""}${description}`, thumbnail_url)).data
                    Object.assign(data, {
                        tweet_id
                    })
                    console.log('Mirrored on twitter')
                }catch(e){
                    console.error(e)
                }
            }

            if(data.pleroma){
                try{
                    const pleroma_id = await (await pleromaSerivce.pleromaArticleMirror(`${description}`)).data
                    Object.assign(data, {
                        pleroma_id
                    })
                    console.log('Mirrored on pleroma')
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

    async getAllCategories(){
        const categoriesQ = await Category.findAll()
        const categories = categoriesQ.map(i => {
            return i.dataValues.name
        })
        return categories
    }

}