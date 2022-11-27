  const post = document.getElementById('post')
  const titleEl = document.getElementById('title')
  const addCategory = document.getElementById('category_add')
  const categoryInput = document.getElementById('category')
  const thumbnailUrlInput = document.getElementById('thumbnail_url')
  const error = document.getElementById('error')
  const api_key = document.getElementById('apikey').value
  const cats = document.getElementById('cats')
  const thumbnailFileInput = document.getElementById('thumbnail')


  var quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: { container:[
          [{ 'font': [] }, { 'size': [] }],
          [ 'bold', 'italic', 'underline', 'strike' ],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'super' }, { 'script': 'sub' }],
          [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
          [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
          [ 'direction', { 'align': [] }],
          [ 'link', 'image', 'imageurl', 'video', 'formula'],
          [ 'clean' ]
    ], handlers: {
      'imageurl': imageHandler
      }
    }
  }
    });


    thumbnailFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      const base64 = await convertBase64(file);
      try{
      const res = await (await fetch(`https://api.cloudinary.com/v1_1/dptqk9qvc/upload`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file: base64,
            folder: 'thumbnail',
            api_key: api_key,
            upload_preset: 'ml_default'
          })
        })).json()
        thumbnailUrlInput.value = res.url
      }catch(e){
        error.innerHTML = e.message
      }
    })


  addCategory.addEventListener('click', () => {
    categories.push(categoryInput.value)
    cats.innerHTML += categoryInput.value + ', '
    categoryInput.value = ""
  })

  let categories = []

  post.addEventListener('click', async () => {

    const title = titleEl.value
    const thumbnail_url = thumbnailUrlInput.value

    if(title.length < 5 || thumbnailUrlInput.value === '') return
    
    let images = document.getElementsByTagName('img')
    
    for (let i = 0; i < images.length; i++) {
      const el = images[i];
      if(el.src.split(':')[0] === 'data') continue
      const base64img = el.src
      const res = await (await fetch(`https://api.cloudinary.com/v1_1/dptqk9qvc/upload`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file: base64img,
            folder: 'general',
            api_key: api_key,
            upload_preset: 'ml_default'
          })
        })).json()
        el.src = res.url
    }


    const description = quill.root.innerHTML;
    if(categories.length === 0) categories = ['Lyrical']

    const res = await (await fetch('/blog/post', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        thumbnail_url,
        categories
      })
  })).json()

  if(!res.success){
    console.log(res)
    return error.innerHTML = res.data
  }

  window.location.replace("/blog/writings/" + res.data.url);

  })



    function imageHandler() {
      const tooltip = this.quill.theme.tooltip;
      const originalSave = tooltip.save;
      const originalHide = tooltip.hide;
    
      tooltip.save = function () {
        const range = this.quill.getSelection(true);
        const value = this.textbox.value;
        if (value) {
          this.quill.insertEmbed(range.index, 'image', value, 'user');
        }
      };
      // Called on hide and save.
      tooltip.hide = function () {
        tooltip.save = originalSave;
        tooltip.hide = originalHide;
        tooltip.hide();
      };
      tooltip.edit('image');
      tooltip.textbox.placeholder = 'Embed URL';
    }


    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
  
          fileReader.onload = () => {
              resolve(fileReader.result);
          };
  
          fileReader.onerror = (error) => {
              reject(error);
          };
      });
  };