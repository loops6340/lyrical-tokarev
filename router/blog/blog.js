const {Router} = require('express');
const { isAdmin } = require('../../controllers/authController');
const ArticlesServices = require('../../services/articles/articles.services');
const router = Router();

let lastPage = 0

const articlesServices = new ArticlesServices()

router.get('/', async (req, res) => {
    try{
        const data = await getAndFilterArticles(Math.floor(Math.random() * lastPage), req.query)
        console.log(data)
        return await renderWithPaginatorAndCategories(data, res)
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.get('/post', isAdmin, async (req, res) => {
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
        return await renderWithPaginatorAndCategories(data, res, 0, 'writings/writings')
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.get('/writings/:writing', async (req, res) => {
    try{
        const article = await articlesServices.getArticleByUrl(req.params.writing)
        if(!article) return res.send('NO.')
        return res.render('writings/writing', {article})
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.get('/writings/page/:page', async (req, res) => {
    try{
    const page = parseInt(req.params.page)
    if(page === 0) return res.redirect('/blog/writings')
    if(!page) return res.redirect('https://kurokona.neocities.org/')
    const data = await getAndFilterArticles(page, req.query)
    if(data.lastPage < page) return res.redirect('https://kurokona.neocities.org/')
    return await renderWithPaginatorAndCategories(data, res, page, 'writings/writings')
    }catch(e){
        console.error(e)
        res.send(e.message)
    }
});

router.post('/post', isAdmin, async (req, res) => {
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
    const _lastPage = Math.floor(articlesAndCount.count/articlesServices.paginated)
    lastPage = _lastPage
    return {...articlesAndCount, lastPage: _lastPage}
}

const renderWithPaginatorAndCategories = async (data, res, page = 0, render = 'blog') => {
    const {articles, count, lastPage} = data
    const categories = await articlesServices.getAllCategories()
    console.log(categories)
    res.render(render, {articles, paginator: {page, lastPage}, count, categories})
}

module.exports = router;