const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

const MAXPLAYERS = 2;

let {gameState, Max, IceWizard, Leon, Giant} = require('./state.js');
let playerCount = 0
let playersInGame = []

io.on('connection', socket => {
    console.log('New user joined ' + socket.id);
    
    socket.on('newPlayer', (data)=>{
        if (playerCount == MAXPLAYERS){
            socket.emit('gameInProgress');
        }
        else {
            switch(data.character){
                case 'Max': gameState.players[socket.id] = new Max (data.username, Math.random()*700, Math.random()*400); break;
                case 'IceWizard': gameState.players[socket.id] = new IceWizard (data.username, Math.random()*700, Math.random()*400); break;
                case 'Leon': gameState.players[socket.id] = new Leon (data.username, Math.random()*700, Math.random()*400); break;
                case 'Giant': gameState.players[socket.id] = new Giant (data.username, Math.random()*700, Math.random()*400); break;
            }
            playerCount ++;
            playersInGame.push(socket.id);
        }
    });
    
    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id];
        if (playersInGame.includes(socket.id)) playerCount--; 
        console.log(gameState.players); 
    })

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (playerMovement.right && player.x+player.radius < 800) player.x += player.xVel;
        if (playerMovement.left && player.x-player.radius > 0) player.x -= player.xVel;
        if (playerMovement.up && player.y-player.radius > 0) player.y -= player.yVel;
        if (playerMovement.down && player.y+player.radius < 500) player.y += player.yVel;
    });

    socket.on('superUsed', ()=>{
        let player = gameState.players[socket.id];
        let canUse = player.checkSuper();
        if (canUse) player.useSuper();
    });
});


setInterval(()=>{
    if (playerCount == MAXPLAYERS){ // right number of players
        // gameStarted = true;
        io.emit('state', gameState);
    } 
    else if (playerCount < MAXPLAYERS) { // needs more players to start
        // gameStarted = false;
        io.emit('waitingForPlayers');
    }
    else {

    }
}, 1000/60);



server.listen((PORT), (e)=>{
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
});