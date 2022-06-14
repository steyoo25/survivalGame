const socket = io();
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let w = canvas.width;
let h = canvas.height;

socket.emit('newPlayer');

socket.on('waiting', waiting); // needs to wait for more players
socket.on('fullGame', fullGame);
socket.on('setupModes', ()=>{
    setInterval(setupModes, 1000/60);
    document.addEventListener('click', (e)=>{
        if (e) console.log('hello!');
    });
});

function waiting(){
    // ctx.clearRect(0, 0, w, h);
    // ctx.beginPath();
    // ctx.font = '50px sherif';
    // ctx.fillStyle = 'white';
    // ctx.fillText('Waiting for players...', w/2-200, h/2);
    // ctx.closePath();
}

function fullGame(){
    alert('Game is full! Please try again later...');
    window.location.href = './index.html';
}

function setupModes(){
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(200, 100, 200, 75);
    ctx.fillRect(400, 250, 200, 75);
    ctx.fillRect(200, 250, 200, 75);
    ctx.fillRect(400, 100, 200, 75);
    ctx.closePath();
}