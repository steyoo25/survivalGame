const socket = io();

socket.emit('newPlayer');

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

canvas.width = screenWidth;
canvas.height = screenHeight;

let page = 'MENU';

let playerMovement = {
    up: false,
    down: false,
    right: false,
    left: false,
    width: canvas.width,
    height: canvas.height
}

socket.on('showScreen', (data) => {
    switch (data.screen) {
        case 'MENU':
            page = 'MENU';
            drawMenu();
            break;
        case 'game':
            page = 'game';
            drawGame();
            break;
    }
})

socket.on('state', (gameState) => {
    for (let player in gameState.players) {
        if (gameState.players[player].currentScreen === 'game') {
            drawGame(gameState.players[player]);
        }
    }
    if (page === 'game') {
        socket.emit('playerMovement', playerMovement);
    }

})

// function drawPlayers(player){

// }

function drawMenu() { // the MENU screen for the newely joined user to see.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = 'black';
    let rectW = 200;
    let rectH = 75;
    ctx.fillStyle = 'white';
    // rectangles for the buttons
    ctx.fillRect(screenWidth / 2 - rectW / 2, 3 * screenHeight / 7 - rectH, rectW, rectH);
    ctx.fillStyle = 'white';
    ctx.fillRect(screenWidth / 2 - rectW / 2, 4 * screenHeight / 7 - rectH, rectW, rectH);
    ctx.fillStyle = 'white';
    ctx.fillRect(screenWidth / 2 - rectW / 2, 5 * screenHeight / 7 - rectH, rectW, rectH);
    // texts
    ctx.font = '50px sherif';
    ctx.fillStyle = 'red';
    ctx.fillText('PLAY', screenWidth / 2 - rectW / 2 + 40, 3 * screenHeight / 7 - rectH + 50, 200);
    ctx.fillStyle = 'blue';
    ctx.fillText('empty', screenWidth / 2 - rectW / 2 + 40, 4 * screenHeight / 7 - rectH + 50, 200); //changeable
    ctx.font = '30px sherif'
    ctx.fillStyle = 'blue';
    ctx.fillText('How to Play', screenWidth / 2 - rectW / 2 + 30, 5 * screenHeight / 7 - rectH + 50, 200);
}

function drawGame(player) { // draw the game screen for the user
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = 'orange';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function handleButtonClick(e) {
    // check for "PLAY"
    if ((e.x >= screenWidth / 2 - 100) && (e.x <= screenWidth / 2 + 100) && (e.y >= 3 * screenHeight / 7 - 75) && (e.y <= screenHeight / 2 + 75)) {
        console.log('play!');
        socket.emit('showScreen', {
            page: 'game'
        })
    }

}

function handleKeydown(e) {
    if (e.key === 'a')
        playerMovement.left = true;
    if (e.key === 'd')
        playerMovement.right = true;
    if (e.key === 'w')
        playerMovement.up = true;
    if (e.key === 's')
        playerMovement.down = true;
}

function handleKeyup(e) {
    if (e.key === 'a')
        playerMovement.left = false;
    if (e.key === 'd')
        playerMovement.right = false;
    if (e.key === 'w')
        playerMovement.up = false;
    if (e.key === 's')
        playerMovement.down = false;
}

function countDown(e) {
    var timeleft = 3;
    var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        document.getElementById("progressBar").value = 3 - timeleft;
        timeleft -= 1;
    }, 1000);
    <progress value="0" max="3" id="progressBar"></progress>
}

document.addEventListener('click', handleButtonClick);
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

MENU = 0
x = 0
y = 0
// function draw() {
//     //image(bg, 0, 0)
//     if (MENU === 1) {
//         background(225)
//         game()
//         if (keyIsDown(77)) {
//           MENU = 0
//         }
//       } // START GAME
//       if (MENU === 2) {

//         if (keyIsDown(77)) {
//           MENU = 0
//         }
//       } // INSTRUCTIONS
//       if (MENU === 3) {
//         background(225)
//         textSize(25)
//         text("Objective: Avoid the obstacles, such as lasers, \nto survive longer than your opponents.", 25, 100)
//         text("Use WASD or arrow keys to move your character.", 25, 200)
//         text("Press M to return to menu",25, 250)   
//         if (keyIsDown(77)) {
//             MENU = 0
//           }
//       } 
//     }

// // handle different events
// function mouseClicked() {
//     if (MENU == 0) {
//         if (mouseX > 200 && mouseX < 400) {
//             if (mouseY > 100 && mouseY < 175) {
//                 MENU = 1
//             }
//             if (mouseY > 250 && mouseY < 325) {
//                 MENU = 2
//             }
//             if (mouseY > 400 && mouseY < 475) {
//                 MENU = 3
//             }
//         }
//     }
// }


// function game() {
//     keyPressed()
//     fill(255,255,255)
//     ellipse(x, y, 50, 50);
// }

// function keyPressed() {
//     if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
//         if (x < 575)
//             x += 5;
//     }

//     if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
//         if (x > 25)    
//             x -= 5;
//     }

//     if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
//         if (y > 25)
//             y -= 5;
//     }

//     if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
//         if (y < 575)
//             y += 5;
//     }
// }

console.log(page);