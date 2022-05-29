const socket = io();

socket.emit('newPlayer');

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

socket.on('state', (gameState)=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (let player in gameState.players){
        draw(gameState.players[player]);
    }
})

function draw(player){
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

let playerMovement = {
    up: false,
    down: false,
    left: false,
    right: false,
};

function keyDown(e){
    if (e.key === 'd'){
        playerMovement.right = true;
    } else if (e.key === 'a') {
        playerMovement.left = true;
    } else if (e.key === 's') {
        playerMovement.down = true;
    } else if (e.key === 'w') {
        playerMovement.up = true;
    }    
}

function keyUp(e){
    if (e.key === 'd'){
        playerMovement.right = false;
    } else if (e.key === 'a') {
        playerMovement.left = false;
    } else if (e.key === 's') {
        playerMovement.down = false;
    } else if (e.key === 'w') {
        playerMovement.up = false;
    }
    if (e.key === ' '){
        socket.emit('ability');
    }
}


setInterval(() => {
    socket.emit('playerMovement', playerMovement);
}, 1000/60);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);