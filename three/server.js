const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

let {gameState, Player, Max, IceWizard, Leon, Rosa, Obstacle} = require('./state.js'); 

io.on('connection', socket => {
    console.log('A connection');
    
    socket.on('newPlayer', (data)=>{
        switch(data.character){
            case 'Max':
                gameState.players[socket.id] = new Max (data.username, Math.random()*800, Math.random()*500);
                break;
            case 'IceWizard':
                gameState.players[socket.id] = new IceWizard (data.username, Math.random()*800, Math.random()*500);
                break;
            case 'Leon':
                gameState.players[socket.id] = new Leon (data.username, Math.random()*800, Math.random()*500);
                break;
            case 'Rosa':
                gameState.players[socket.id] = new Rosa (data.username, Math.random()*800, Math.random()*500);
                break;
        }
    });

    setInterval(()=>{
        gameState.obstacles.push(new Obstacle (-100, Math.random()*500));
    }, 5000);
    
    setInterval(()=>{
        for (let i in gameState.obstacles){
            let obstacle = gameState.obstacles[i];
            obstacle.x += obstacle.xVel;
            obstacle.y += obstacle.yVel; 
        }
    }, 10)

    socket.on('disconnect', ()=>{
        delete gameState.players[socket.id]; // handles when a player leaves
    })

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (playerMovement.right && player.x+player.radius < 800)
            player.x += player.xVel;
        if (playerMovement.left && player.x-player.radius > 0)
            player.x -= player.xVel;
        if (playerMovement.up && player.y-player.radius > 0)
            player.y -= player.yVel;
        if (playerMovement.down && player.y+player.radius < 500)
            player.y += player.yVel;
    });

    socket.on('superUsed', ()=>{
        let player = gameState.players[socket.id];
        let canUse = player.checkSuper();
        if (canUse){
            player.useSuper();
        }
    });
});

setInterval(()=>{
    io.emit('state', gameState); 
}, 1000/60);

server.listen((PORT), (e)=>{
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
});