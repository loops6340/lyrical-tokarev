const topSprites = document.getElementsByClassName('top-sprite')

for(let i = 0; i < topSprites.length; i++){
    const sprite = topSprites[i]
    sprite.addEventListener('mouseover', () => {
        sprite.children[1].style.color = 'yellow'
        sprite.style.animationPlayState = 'paused';
    })
    sprite.addEventListener('mouseout', () => {
        sprite.children[1].style.color = 'white'
        sprite.style.animationPlayState = 'running';
    })
}