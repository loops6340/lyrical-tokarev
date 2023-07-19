let current = 1

addEventWithTimeout()

function mouseOverHandler(){
    current++
    document.getElementById('text'+current).style.animationPlayState = "running"
    document.getElementById('text'+current).style.visibility = "visible"
    document.getElementById('text'+(current-1)).removeEventListener('mouseover', mouseOverHandler)
    if(current < 4) addEventWithTimeout()
}

function addEventWithTimeout(){
    setTimeout(() => {
        document.getElementById('text'+current).addEventListener('mouseover', mouseOverHandler)
    }, 1730)
}