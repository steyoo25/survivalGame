const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {gameState, Player} = require('./state');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket=>{
    console.log('connection made');
    
    let color = Math.random() < 0.5 ? 'red' : 'black'; // temporary, change later

    socket.on('newPlayer', ()=>{
        if (color === 'red'){
            gameState.players[socket.id] = new Player(400, 400, 25, 25, color, 'big');
        }
        else {
            gameState.players[socket.id] = new Player(250, 250, 25, 25, color, 'speed');
        }
    })
    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id];
    })
    
    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        let canvasW = 600;
        let canvasH = 600;
        if (playerMovement.left && player.x > 0)
            player.x -= player.xVel;
        if (playerMovement.right && player.x < canvasW - player.width)
            player.x += player.xVel;
        if (playerMovement.up && player.y > 0)
            player.y -= player.yVel;
        if (playerMovement.down && player.y < canvasH - player.height)
            player.y += player.yVel;
    });

    socket.on('ability', ()=>{
        let player = gameState.players[socket.id];
        let canUse = player.useAbilityCheck();
        if (canUse){
            player.useAbility();
        }
    });
    
})

setInterval(()=>{
    io.emit('state', gameState);
}, 1000/60);

server.listen(PORT, (error)=>{
    if (error) throw error;
    else console.log(`Server listening on ` + PORT);
})