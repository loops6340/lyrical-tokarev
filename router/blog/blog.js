const {Router} = require('express');
const ArticlesServices = require('../../services/articles/articles.services');
const router = Router();

const articlesServices = new ArticlesServices()

router.get('/', async (req, res) => {
    try{
        const data = await getAndFilterArticles(0, req.query)
        return renderWithPaginator(data, res)
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.get('/post', async (req, res) => {
    try{
    return res.render('writings/post')
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
})

router.get('/writings', async (req, res) => {
    try{
        const data = await getAndFilterArticles(0, req.query)
        return renderWithPaginator(data, res)
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.get('/writings/:page', async (req, res) => {
    try{
    const page = parseInt(req.params.page)
    if(!page || page <= 0) return res.redirect('https://kurokona.neocities.org/')
    const data = await getAndFilterArticles(page, req.query)
    if(data.lastPage < page) return res.redirect('https://kurokona.neocities.org/')
    return renderWithPaginator(data, res, page)
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.post('/post', async (req, res) => {
    try{
        const {body} = req
        for(const prop in body){
            console.log(prop)
            if(body[prop] === '') return res.status(400).json({
                success: false,
                data: 'No ' + prop + ' received.'
            })
        }
        const data = await articlesServices.createArticle(body)
        if(!res.success) return res.status(500).json(data)
        return res.status(200).json(data)
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
})


const getAndFilterArticles = async (page = 0, queries = []) => {
    let filters = []
    for(const param in queries){
        filters.push(param)
    }
    const articlesAndCount = await articlesServices.getAllArticles(page, filters, true)
    return {...articlesAndCount, lastPage: Math.floor(articlesAndCount.count/articlesServices.paginated)}
}

const renderWithPaginator = (data, res, page = 0, render = 'blog') => {
    const {articles, count, lastPage} = data
    res.render(render, {articles, paginator: {page, lastPage}, count})
}

module.exports = router;