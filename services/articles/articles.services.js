const axios = require('axios')
const {Article, Category} = require('../../db/db')



module.exports = class ArticlesServices{
    constructor(){
        this.paginated = 20
    }

    async createArticle(data){
        try{
            const imageDataRes = await axios.get(data.thumbnail_url)
            
            const thumbnail_size = imageDataRes.headers['content-length']
            const thumbnail_type = imageDataRes.headers['content-type']

            const url = data.title.toLowerCase().split(' ').join('-')

            Object.assign(data, {
                thumbnail_size,
                thumbnail_type,
                url,
            })



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

        const query = {include: {model: Category}, limit: this.paginated, offset: page*this.paginated}

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

}