const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

let {gameState, Max, IceWizard, Leon, Rosa} = require('./state.js'); 
let gameStarted = false;
let playerCount = 0

io.on('connection', socket => {
    console.log('A connection');
    
    socket.on('newPlayer', (data)=>{
        let spectating = false;
        if (gameStarted) spectating = true;
        switch(data.character){
            case 'Max': gameState.players[socket.id] = new Max (data.username, Math.random()*800, Math.random()*500, spectating); break;
            case 'IceWizard': gameState.players[socket.id] = new IceWizard (data.username, Math.random()*800, Math.random()*500, spectating); break;
            case 'Leon': gameState.players[socket.id] = new Leon (data.username, Math.random()*800, Math.random()*500, spectating); break;
            case 'Rosa': gameState.players[socket.id] = new Rosa (data.username, Math.random()*800, Math.random()*500, spectating); break;
        }
        playerCount++;
    });
    
    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id]; // handles when a player leaves
    })

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (!player.spec){
            if (playerMovement.right && player.x+player.radius < 800) player.x += player.xVel;
            if (playerMovement.left && player.x-player.radius > 0) player.x -= player.xVel;
            if (playerMovement.up && player.y-player.radius > 0) player.y -= player.yVel;
            if (playerMovement.down && player.y+player.radius < 500) player.y += player.yVel;
        }
    });

    socket.on('superUsed', ()=>{
        let player = gameState.players[socket.id];
        let canUse = player.checkSuper();
        if (canUse) player.useSuper();
    });
});

setInterval(()=>{
    if (playerCount==4) startGame(); // if there's at least four, start the game!
}, 1000/60);

function startGame(){
    io.emit('state', gameState);
    gameStarted = true;
}

server.listen((PORT), (e)=>{
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
});