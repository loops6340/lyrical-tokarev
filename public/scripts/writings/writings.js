const url = window.location.href
const splitUrl = url.split('?')
const categories = document.getElementsByClassName('category')

for(cat of categories){
    const catName = cat.innerHTML
    if(!splitUrl.includes(catName)){
        cat.href = `${url}?${catName}`
    }else{
        const newUrl = splitUrl.filter(i =>{
            return i !== catName
        }).join('?')
        cat.href = newUrl
        cat.style.color = '#00aae4'
    }
}
