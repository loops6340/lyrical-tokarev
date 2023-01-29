const socket = io();

const chatBody = document.getElementById('chatBody')
const messageForm = document.getElementById('messageForm')

socket.on('SEND_MESSAGE_FROM_SERVER', (m) => {
    const item = document.createElement('li');
    item.textContent = `${m.author}: ${m.text}`;
    chatBody.appendChild(item);
    chatBody.scrollTo(0, chatBody.scrollHeight);
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const {author, text} = e.target
    console.log(author.value)
    socket.emit('SEND_MESSAGE_TO_SERVER', ({
        author: author.value,
        text: text.value
    }))
})

