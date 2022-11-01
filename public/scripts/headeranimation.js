const topSprites = document.getElementsByClassName("top-sprite");

setTimeout(() => {
  for (let i = 0; i < topSprites.length; i++) {
    const sprite = topSprites[i];
    sprite.addEventListener("mouseover", () => {
      sprite.children[1].style.color = "yellow";
      sprite.style.animationPlayState = "paused";
      if (sprite.children[1].innerHTML === "GUESTBOOK") {
        sprite.children[0].src =
          "/public/images/headersprites/hover/alicemssprite.gif";
      }
    });
    sprite.addEventListener("mouseout", () => {
      sprite.children[1].style.color = "white";
      sprite.style.animationPlayState = "running";
      if (sprite.children[1].innerHTML === "GUESTBOOK") {
        sprite.children[0].src =
          "/public/images/headersprites/alicemssprite.png";
      }
    });
  }
}, 6100);
