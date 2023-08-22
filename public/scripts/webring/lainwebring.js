const alive = document.getElementById('alive')
const dead = document.getElementById('dead')
const tor = document.getElementById('tor')
const i2p = document.getElementById('i2p')
const rss = document.getElementById('rss')

fetch('public/lainring/lainring.json', {
})
  .then(r => r.json())
  .then(json => {
    console.log(json)
    const items = shuffle(json.items)

    items.forEach(i => {
        if(!i.offline){
        alive.innerHTML += createElement(i.url, i.title, i.img)

        if(i.i2p){
            i2p.innerHTML += createElement(i.i2p, i.title, i.img)
        }

        if(i.tor){
            tor.innerHTML += createElement(i.tor, i.title, i.img)
        }

        if(i.feed){
            rss.innerHTML += '<br>' + i.feed
        }
    }else{
        dead.innerHTML += createElement(i.url, i.title, i.img)
    }
    })
  }).catch(e => {
    console.log("Error fetching data " + e)
  })

  function createElement(url, title, image){
    return `
    <div class="site-container">
        <a target="_blank" href="${url}">
            <img title="${title}" width="240" height="60" src="public/lainring/images/${image}">
        </a>
    </div>
    `
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }