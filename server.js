const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socketio(server);

const MAXPLAYERS = 4;

`Variables that will be reset every game---`
let playerCount = 0;
let playersInGame = [];
let modeSelectCount = 0;
let modeVoted = [];
let currentMode;
let characterSelectCount = 0;
let skipCharacterSelectCount = 0;
let instReadCount = 0;
let readyCount = 0;

let {gameState, Max, IceWizard, Leon, Giant, Normal} = require('./state.js');

io.on('connection', socket => {
    console.log(`User ${socket.id} joined!`);

    socket.on('disconnect', ()=>{
        deletePlayer(socket);
    })

    socket.on('newPlayer', ()=>{
        if (initialCheck()) socket.emit('fullGame'); // game is already full
        else {
            playerCount++;
            playersInGame.push(socket.id);
            if (initialCheck()) io.emit('setupModes'); // if there are enough players now
            else socket.emit('waiting'); // there aren't enough players who joined yet. 
        }
    });

    socket.on('modeSelected', (mode)=>{
        modeSelectCount++;
        modeVoted.push(mode);
        if (check(modeSelectCount)){
            currentMode = selectMode(modeVoted);
            console.log(currentMode);
            io.emit('setupInst', currentMode);
        }
    });

    socket.on('instRead', ()=>{ 
        instReadCount++;
        if (check(instReadCount)){
            console.log('all ready');
            switch(currentMode){
                case 'classic': 
                    io.emit('skipCharacterSelection');
                    break;
                case 'superpower':
                    io.emit('setupCharacterSelection'); // after they finish reading instructions (will be displayed for ~15 seconds)
                    break;
            }
        }
    })

    socket.on('characterSelected', (data)=>{
        let username = data.username;
        let character = data.character;
        characterSelectCount++;
        switch(character){
            case 'Max': gameState.players[socket.id] = new Max (username, Math.random()*650, Math.random()*300 + 100); break;
            case 'IceWizard': gameState.players[socket.id] = new IceWizard (username, Math.random()*650, Math.random()*300+100); break;
            case 'Leon': gameState.players[socket.id] = new Leon (username, Math.random()*650, Math.random()*300+100); break;
            case 'Giant': gameState.players[socket.id] = new Giant (username, Math.random()*650, Math.random()*300+100); break;
        }
        if (check(characterSelectCount)){
            let tagger = selectTagger();
            io.emit('setupTagger', tagger);
        }
    });

    socket.on('skipCharacterSelected', (data)=>{
        let username = data.username;
        skipCharacterSelectCount++;
        gameState.players[socket.id] = new Normal(username, Math.random()*650, Math.random()*300 + 100);
        if (check(skipCharacterSelectCount)){
            let tagger = selectTagger();
            io.emit('setupTagger', tagger);
        }
    })

    socket.on('ready', ()=>{
        readyCount++;
        if (check(readyCount)){
            io.emit('gameBegan');
            startGame();
        }
    });

    socket.on('playerMovement', (playerMovement)=>{
        let player = gameState.players[socket.id];
        if (playerMovement.right && player.x+player.radius < 800) player.x += player.xVel;
        if (playerMovement.left && player.x-player.radius > 0) player.x -= player.xVel;
        if (playerMovement.up && player.y-player.radius > 0) player.y -= player.yVel;
        if (playerMovement.down && player.y+player.radius < 500) player.y += player.yVel;
        if (player.tagger){
            for (let i in gameState.players){
                if (checkTouching(player, gameState.players[i]) && player.canTag){
                    player.tagger = false;
                    gameState.players[i].tagger = true;
                    gameState.players[i].canTag = false;
                    setTimeout(() => {
                        gameState.players[i].canTag = true;
                    }, 1500);
                }
            }
        }
        
    });

    socket.on('superUsed', ()=>{
        let player = gameState.players[socket.id];
        let canUse = player.checkSuper();
        if (canUse) player.useSuper();
    });

    socket.on('gameOver', ()=>{
        let winners = getWinner();
        socket.emit('setupGameover', winners);
    });

    socket.on('exit', ()=>{
        socket.emit('returnHome');
    });

});

server.listen((PORT), e => {
    if (e) throw error;
    else console.log(`Server listening on PORT ${PORT}`);
});

function startGame(){ //Runs when the actual game begins, after mode selection.
    setInterval(()=>{
        io.emit('state', gameState);
        for (let i in gameState.players){
            if (!gameState.players[i].tagger) gameState.players[i].points ++;
        }
    }, 1000/60);
}

function initialCheck (){
    if (playerCount === MAXPLAYERS) return true; // exactly the right number of players
    else if (playerCount < MAXPLAYERS) return false; // has to wait for more to join
}

function check(count){
    if (count === playerCount) return true;
    else if (count < playerCount) return false;
}

function selectMode(modeVoteList){
    let c = 0;
    let s = 0;
    let i = 0;
    
    let maxSoFar = 0
    for (const mode of modeVoteList){ // loops thru the values (?)
        switch (mode){
            case 'classic': c++; break;
            case 'superpower': s++; break;
            // case 'infection': i++; break;
        }
    }
    maxSoFar = Math.max(c,s,i);

    let mostVotedModes = [];
    if (modeVoteList.filter(mode=>mode==='classic').length === maxSoFar){
        mostVotedModes.push('classic');
    }
    if (modeVoteList.filter(mode=>mode==='superpower').length === maxSoFar){
        mostVotedModes.push('superpower');
    }
    // if (modeVoteList.filter(mode=>mode==='infection').length === maxSoFar){
    //     mostVotedModes.push('infection');
    // }

    let rand = Math.floor(Math.random()*mostVotedModes.length);
    let selected = mostVotedModes[rand] 

    return selected;
}

function selectTagger(){
    let i = Math.floor(Math.random()*playersInGame.length);
    let randomSocket = playersInGame[i];
    gameState.players[randomSocket].tagger = true;
    return gameState.players[randomSocket];
}

function checkTouching(player, otherP){
    let distance = Math.sqrt((player.x-otherP.x)**2+(player.y-otherP.y)**2); 
    if (distance<=2*player.radius && distance>0) return true;
    else return false;
}

function getWinner(){
    let maxSoFar = 0;
    for (let i in gameState.players){
        if (gameState.players[i].points>maxSoFar) maxSoFar = gameState.players[i].points;
    }
    let topPlayers = [];
    for (let i in gameState.players){
        if (gameState.players[i].points === maxSoFar) topPlayers.push(gameState.players[i]); 
    }

    return topPlayers;
}

function deletePlayer(socket){
    delete gameState.players[socket.id];
    const i = playersInGame.indexOf(socket.id);
    playersInGame.splice(i, 1);
    --playerCount;
    if (playerCount===0){
        playerCount = 0;
        playersInGame = [];
        modeSelectCount = 0;
        modeVoted = [];
        currentMode;
        characterSelectCount = 0;
        skipCharacterSelectCount = 0;
        instReadCount = 0;
        readyCount = 0;
    }
}