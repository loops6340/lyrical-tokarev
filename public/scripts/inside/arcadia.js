let current = 1

document.getElementById('text'+current).addEventListener('mouseover', mouseOverHandler)

function mouseOverHandler(){
    current++
    document.getElementById('text'+current).style.animationPlayState = "running"
    document.getElementById('text'+current).style.visibility = "visible"
    document.getElementById('text'+(current-1)).removeEventListener('mouseover', mouseOverHandler)
    if(current < 4) document.getElementById('text'+current).addEventListener('mouseover', mouseOverHandler)
}
