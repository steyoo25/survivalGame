const socket = io();

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;

socket.emit('newMode');

socket.on('waitingForPlayers', ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = '50px sherif';
    ctx.fillStyle = 'white';
    ctx.fillText('Waiting for players...', canvas.width/2-200, canvas.height/2);
    ctx.closePath();
});

socket.on('gameInProgress', ()=>{
    alert('Game is full, please try again later!');
    window.location.href = './index.html';
});

socket.on('beginModeSelection', ()=>{
    let mode = 'superpower';
    sessionStorage.setItem('mode', mode);
    if (mode==='superpower'){
        window.location.href = './characters.html';
    }
});