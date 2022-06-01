const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

// importing from other files
let {gameState, Player} = require('./state.js');

io.on('connection', socket=>{
    console.log('New user joined the server.');
    
    socket.on('newPlayer', ()=>{
        console.log(`Hello, User ${socket.id}!`);
        gameState.players[socket.id] = new Player(300, 300, 20);
        let player = gameState.players[socket.id];
        socket.emit('showScreen', {
            screen: player.currentScreen
        });
    });

    socket.on('showScreen', (data)=>{
        let player = gameState.players[socket.id];
        if (data.page){
            player.currentScreen = data.page;
            socket.emit('showScreen', {
                screen: player.currentScreen
            })
        }
    })

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (playerMovement.left && player.x - player.radius > 0)
            player.x -= player.xVel;
        if (playerMovement.right && player.x < playerMovement.width - player.radius){
            player.x += player.xVel;
        }
        if (playerMovement.up && player.y - player.radius > 0)
            player.y -= player.yVel;
        if (playerMovement.down && player.y < playerMovement.height - player.radius)
            player.y += player.yVel;
    })

});

setInterval(()=>{
    io.emit('state', gameState)
}, 1000/60)

const PORT = process.env.PORT || 3000;
server.listen(PORT, (error)=>{
    if (error) throw error;
    else console.log(`Server listening on Port ${PORT}!`);
});