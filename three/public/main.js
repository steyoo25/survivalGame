const socket = io();

canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

socket.emit('newPlayer', {
    username: sessionStorage.getItem('username'),
    character: sessionStorage.getItem('character')
});

socket.on('state', (gameState)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let player in gameState.players){
        drawPlayer(gameState.players[player]);
    } // draw function for each Player object

    for (let obstacle in gameState.obstacles){
        drawObstacle(gameState.obstacles[obstacle]);
    }
})

function drawPlayer(player){
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    ctx.fill();

    if (!player.invis) // check if the player is invisible
        ctx.fillStyle = 'white';
    else 
        ctx.fillStyle = 'rgba(100,100,100,0)';
    
    ctx.font = '20px times';
    let username = player.username;
    ctx.fillText(username, player.x-username.length*4.5, player.y-20);
    ctx.closePath();
}

function drawObstacle(obstacle){
    if (obstacle.x>canvas.width)
        delete obstacle;
    else if (obstacle.x<0)
        delete obstacle;
    else if (obstacle.y>canvas.height)
        delete obstacle;
    else if (obstacle.y<0)
        delete obstacle;
    else {
        ctx.beginPath();
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.closePath();
    }
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