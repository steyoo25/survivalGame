const socket = io();

canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

socket.emit('newPlayer');

socket.on('state', (gameState)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let player in gameState.players){
        draw(gameState.players[player]);
    }
})


function draw(player){
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    ctx.fill();
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