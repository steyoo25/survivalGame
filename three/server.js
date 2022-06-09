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
let gameMode;

io.on('connection', socket => {
    console.log('New user joined ' + socket.id);
    
    socket.on('newMode', ()=>{
        if (howManyJoined()===0){
            socket.emit('gameInProgress');
        }
        else {
            playerCount++;
            if (howManyJoined()===-1){
                socket.emit('waitingForPlayers');
            }
            else if (howManyJoined()===0) {
                io.emit('beginModeSelection');
                playerCount = 0;
            };
        }
    })

    socket.on('setupMode', (mode)=>{
        gameMode = mode;
    })

    socket.on('newPlayer', (data)=>{
        if (howManyJoined()===0){
            socket.emit('gameInProgress');
        }
        else {
            playerCount++;
            playersInGame.push(socket.id);
            switch (gameMode){
                case 'superpower': startSuperpowerMode(socket, data.username, data.character); break;
            }
            if (howManyJoined()===-1){
                socket.emit('waitingForPlayers');
            }
        }
    })
    
    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id];
        if (playersInGame.includes(socket.id)){
            playerCount--;
            playersInGame.splice(playersInGame.indexOf(socket.id), 1);
        }  
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
    let playerNums = howManyJoined();
    if (playerNums===0) io.emit('state', gameState); // right number of players
    else if (playerNums===-1) io.emit('waitingForPlayers'); // needs more players to start
}, 1000/60);

function howManyJoined(){
    if (playerCount == MAXPLAYERS) return 0 // 0 indicates full
    else if (playerCount < MAXPLAYERS) return -1; // -1 means it needs more
}

function startSuperpowerMode(socket, username, character){
    switch(character){
        case 'Max': gameState.players[socket.id] = new Max (username, Math.random()*700, Math.random()*400); break;
        case 'IceWizard': gameState.players[socket.id] = new IceWizard (username, Math.random()*700, Math.random()*400); break;
        case 'Leon': gameState.players[socket.id] = new Leon (username, Math.random()*700, Math.random()*400); break;
        case 'Giant': gameState.players[socket.id] = new Giant (username, Math.random()*700, Math.random()*400); break;
    }
}

server.listen((PORT), (e)=>{
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
});