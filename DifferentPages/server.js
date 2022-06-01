const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

let {gameState, Player} = require('./state.js'); 

io.on('connection', socket => {
    console.log('A connection');
    socket.on('newPlayer', ()=>{
        gameState.players[socket.id] = new Player(500, 200, 20, 'white');
    });

    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id]; // handles when a player leaves
    })

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (playerMovement.right)
            player.x += player.xVel;
        if (playerMovement.left)
            player.x -= player.xVel;
        if (playerMovement.up)
            player.y -= player.yVel;
        if (playerMovement.down)
            player.y += player.yVel;
    });
})

setInterval(()=>{
    io.emit('state', gameState);
}, 1000/60)

server.listen((PORT), (e)=>{
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
})