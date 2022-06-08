const socket = io();

canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

socket.emit('setupMode', (sessionStorage.getItem('mode'))); // got which mode it is from modes.html, sending it to setup mode to the server

socket.emit('newPlayer', {
    username: sessionStorage.getItem('username'),
    character: sessionStorage.getItem('character')
});

socket.on('gameInProgress', ()=>{
    alert('Game is full, please try again later!');
    window.location.href = './index.html';
});

socket.on('waitingForPlayers', ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = '50px sherif';
    ctx.fillStyle = 'white';
    ctx.fillText('Waiting for players...', canvas.width/2-200, canvas.height/2);
    ctx.closePath();
});

socket.on('state', (gameState)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let player in gameState.players){
        drawPlayer(gameState.players[player]);
    } // draw function for each Player object
})

function drawPlayer(player){
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    if (!player.spec) ctx.fill();
    if (!player.invis) ctx.fillStyle = 'white'; // check if the player is invisible
    else ctx.fillStyle = 'rgba(100,100,100,0)';
    
    ctx.font = '20px times';
    ctx.fillText(player.username, player.x-player.username.length*4.5, player.y-20);
    ctx.closePath();
}

let playerMovement = {
    right: false,
    left: false,
    up: false,
    down: false
}

function handleKeydown(e){
    switch(e.key){
        case 'a': playerMovement.left = true; break;
        case 'd': playerMovement.right = true; break;
        case 'w': playerMovement.up = true; break;
        case 's': playerMovement.down = true; break;
    }
    if (e.key===' '){
        socket.emit('superUsed');
    }
}

function handleKeyup(e){
    switch(e.key){
        case 'a': playerMovement.left = false; break;
        case 'd': playerMovement.right = false; break;
        case 'w': playerMovement.up = false; break;
        case 's': playerMovement.down = false; break;
    }
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

setInterval(()=>{
    socket.emit('playerMovement', playerMovement);
}, 1000/60);
