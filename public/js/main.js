const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('#chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//User join room
socket.emit('joinRoom', {username, room});

//Get room information
socket.on('roomUsers', ({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
});


//When messages are sent
socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
});

//message input handling`
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputRoomName(room){
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}<li>`).join('')}
  `;
}

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('#chat-messages').appendChild(div);
}
