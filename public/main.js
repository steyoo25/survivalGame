const socket = io();

socket.emit('newPlayer');

let playerMovement = {right:false,left:false,up:false,down:false};
let inGame = false;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

socket.on('waiting', waiting); // needs to wait for more players
socket.on('fullGame', fullGame);
socket.on('setupModes', ()=>{
    clear();
    setupModes();
});
socket.on('setupInst', (currentMode)=>{
    clear();
    setupInst(currentMode);
});
socket.on('setupCharacterSelection', ()=>{
    clear();
    setupCharacterSelection();
});

socket.on('skipCharacterSelection', ()=>{
    clear();
    let username = sessionStorage.getItem('username');
    socket.emit('skipCharacterSelected', {
        username: username
    })
})

socket.on('setupTagger', (tagger)=>{
    clear();
    setupTagger(tagger.username);
});

socket.on('gameBegan', ()=>{
    clear();
    document.querySelector('section').style.marginTop = 'auto';
    document.querySelector('section').style.color = '#f2ba49';
    document.querySelector('section').style.fontFamily = 'times';
    canvas.style.display = 'block';
    handlePlayerMovement();
    countDown(3, 'START');
    setTimeout(() => {
        inGame = true;
        countDown(60, 'GAME OVER');
        setTimeout(() => {
            inGame=false;
            setTimeout(()=>{
                socket.emit('gameOver');
            }, 3000)
        }, 60500);
    }, 3500);
});

socket.on('setupGameover', (winners)=>{
    console.log(winners);
    clear();
    document.querySelector('canvas').style.display = 'none';
    document.querySelector('section').style.marginTop = '200px';
    document.querySelector('section').style.color = 'white';
    document.querySelector('section').style.fontFamily = 'courier new';
    let message = document.createElement('h1');
    let names = [];
    let colors = [];

    for (const winner of winners){
        names.push(winner.username);
        colors.push(winner.color);
    }

    console.log(colors[0]);
    if (names.length===1){
        message.textContent = `Winner: ${names}!`;
        document.querySelector('body').style.backgroundImage = `linear-gradient(${colors[0]}, ${colors[0]})`;
    } else {
        message.textContent = `Winners: ${names.join(', ')}`;
    }
    putonScreen([message]);
    
    const exitButton = document.createElement('button');
    exitButton.textContent = 'EXIT';
    exitButton.className = 'characterButton';
    exitButton.addEventListener('click', ()=>{
        socket.emit('exit');
    });
    setTimeout(()=>{
        putonScreen([exitButton]);
    }, 3000);

});

socket.on('returnHome', ()=>{
    window.location.href = './index.html';
});

socket.on('state', (gameState)=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (let player in gameState.players){
        draw(gameState.players[player], ctx);
    }
});

function clear() { // clears content of <section>
    document.querySelector('section').innerHTML='';
}

function putonScreen(l) {
    for (const elm of l){
        document.querySelector('section').appendChild(elm);
    }
}

function waiting(){
    clear();
    const message = document.createElement('p');
    message.textContent = 'Waiting for players...';
    message.style.display = 'block';
    message.style.color = '#39FF14';
    message.style.alignContent = 'center';
    message.style.fontSize = '50px';
    putonScreen([message]);
}

function fullGame(){
    alert('Game is full! Please try again later...');
    window.location.href = './index.html';
}

function setupModes(){
    let v = '';
    const message = document.createElement('h1'); 
    message.textContent = 'Vote for mode'; message.style.display = 'block'; message.style.fontSize = '50px'; message.style.color = 'white';
    const classicButton = document.createElement('button'); 
    classicButton.textContent = 'Classic'; classicButton.style.display = 'block';
    classicButton.className = 'modeButton';
    classicButton.style.backgroundColor = 'coral';
    const superpowerButton = document.createElement('button'); 
    superpowerButton.textContent = 'Superpower'; superpowerButton.style.display = 'block';
    superpowerButton.className = 'modeButton';
    superpowerButton.style.backgroundColor = 'lightblue';
    // const infectionButton = document.createElement('button'); 
    // infectionButton.textContent = 'Infection'; infectionButton.style.display = 'block';
    // infectionButton.className = 'modeButton';
    // infectionButton.style.backgroundColor = 'lightgreen';
    const confirmButton = document.createElement('button'); 
    confirmButton.textContent = 'Confirm'; confirmButton.style.display = 'block'; 
    confirmButton.className = 'modeButton';
    confirmButton.style.backgroundColor = 'black';
    confirmButton.style.color = 'white';
    
    putonScreen([message, classicButton, superpowerButton, confirmButton]); // infection before confirm
    classicButton.addEventListener('click', ()=>{
        document.querySelector('body').style.backgroundImage= 'radial-gradient(#DC1C13,#EA4C46,#F07470)';
        v = 'classic'
    });
    superpowerButton.addEventListener('click', ()=>{
        document.querySelector('body').style.backgroundImage= 'radial-gradient(#0000FF,#4949FF,#A3A3FF)';
        v = 'superpower';
    });
    // infectionButton.addEventListener('click', ()=>{
    //     document.querySelector('body').style.backgroundImage= 'radial-gradient(#2EB62C,#57C84D, #ABE098)';
    //     v = 'infection';
    // });
    confirmButton.addEventListener('click', ()=>{
        confirmButton.disabled = true;
        classicButton.disabled = true;
        superpowerButton.disabled = true;
        // infectionButton.disabled = true;

        document.querySelector('body').style.backgroundImage = 'radial-gradient(black, black)';
        socket.emit('modeSelected', v);
    });
}

let i = 0;
function type() {
    let speed = 50;
    if (i < String(txt).length) {
        let char = txt.charAt(i);
        if (char === '/'){
            document.querySelector("section").innerHTML = '';
            setTimeout(()=>{
                setTimeout(type, speed)
            }, 1500);            
        } else if (char === '|'){
            setTimeout(()=>{
                setTimeout(type, speed)
                document.querySelector("section").innerHTML = '';
            }, 3000);
        } else if (char === '-'){
            const enterButton = document.createElement('button');
            enterButton.textContent = 'ENTER';
            enterButton.className = 'enterButton';
            putonScreen([enterButton]);
            enterButton.addEventListener('click', ()=>{
                socket.emit('instRead');
                enterButton.disabled = true;
            })
        } else if (char==='_'){
            const joinButton = document.createElement('button');
            joinButton.textContent='READY';
            joinButton.className='joinButton';
            putonScreen([joinButton]);
            joinButton.addEventListener('click', ()=>{
                socket.emit('ready');
                joinButton.disabled = true;
            })
        } else {
            setTimeout(() => {
                setTimeout(type, speed);
                document.querySelector("section").innerHTML += char;
            }, 50);
        } 
        i++;
    } 
}

function setupInst(t){
    switch(t){
        case 'classic': txt = `Selected Mode: Classic|Welcome to Classic mode./Score the highest point to win!/Good luck!|-`; break;
        case 'superpower': txt = 'Selected Mode: Superpower|Welcome to Superpower mode./Score the highest point to win!/Each player is a superhero with a unique ability(which can be used 3 times with SPACE bar)./Teleporting players to character selection screen|-'; break;
        // case 'infection': txt = 'c|-'; break;
    }
    document.querySelector('section').style.color = '#39FF14';
    document.querySelector('section').style.fontSize = '50px';
    document.querySelector('section').style.fontFamily = 'courier new';

    type();
}

function setupCharacterSelection(){
    const inst = document.createElement('p');
    inst.textContent = 'Choose your character!';
    inst.className = 'inst';
    const currentImage = document.createElement('img');
    currentImage.setAttribute('src', 'images/blackcircle.png');
    const maxButton = document.createElement('button');
    maxButton.textContent = 'Max';
    maxButton.style.backgroundColor = 'yellow';
    const icewizardButton = document.createElement('button');
    icewizardButton.textContent = 'Ice Wizard';
    icewizardButton.style.backgroundColor = 'lightblue';
    const leonButton = document.createElement('button');
    leonButton.textContent = 'Leon';
    leonButton.style.backgroundColor = 'purple';
    const giantButton = document.createElement('button');
    giantButton.textContent = 'Giant';
    giantButton.style.backgroundColor = 'orange';
    maxButton.className = 'characterButton';
    icewizardButton.className = 'characterButton';
    leonButton.className = 'characterButton';
    giantButton.className = 'characterButton';
    currentImage.className = 'characterImage';
    const confirmButton = document.createElement('button'); 
    confirmButton.textContent = 'Confirm'; confirmButton.style.display = 'block'; 
    confirmButton.className = 'modeButton';
    confirmButton.style.backgroundColor = 'black';
    confirmButton.style.color = 'white';
    let chosen = 'Max';
    maxButton.addEventListener('click', ()=>{
        currentImage.setAttribute('src', 'images/yellowCircle.png');
        chosen = 'Max';
    });
    icewizardButton.addEventListener('click', ()=>{
        currentImage.setAttribute('src', 'images/lightblueCircle.png');
        chosen = 'IceWizard';
    });
    leonButton.addEventListener('click', ()=>{
        currentImage.setAttribute('src', 'images/purpleCircle.png');
        chosen = 'Leon';
    });
    giantButton.addEventListener('click', ()=>{
        currentImage.setAttribute('src', 'images/orangeCircle.png');
        chosen = 'Giant';
    });
    maxButton.addEventListener('mouseenter', ()=>{
        maxButton.style.backgroundColor='black';
        maxButton.style.color='red';
    });
    icewizardButton.addEventListener('mouseenter', ()=>{
        icewizardButton.style.backgroundColor='black';
        icewizardButton.style.color='red';
    });
    leonButton.addEventListener('mouseenter', ()=>{
        leonButton.style.backgroundColor='black';
        leonButton.style.color='red';
    });
    giantButton.addEventListener('mouseenter', ()=>{
        giantButton.style.backgroundColor='black';
        giantButton.style.color='red';
    });
    maxButton.addEventListener('mouseleave', ()=>{
        maxButton.style.backgroundColor='yellow';
        maxButton.style.color='black';
    });
    icewizardButton.addEventListener('mouseleave', ()=>{
        icewizardButton.style.backgroundColor='lightblue';
        icewizardButton.style.color='black';
    });
    leonButton.addEventListener('mouseleave', ()=>{
        leonButton.style.backgroundColor='purple';
        leonButton.style.color='black';
    });
    giantButton.addEventListener('mouseleave', ()=>{
        giantButton.style.backgroundColor='orange';
        giantButton.style.color='black';
    });
    let username = sessionStorage.getItem('username');
    confirmButton.addEventListener('click', ()=>{
        socket.emit('characterSelected', {
            username: username,
            character: chosen
        });
        confirmButton.disabled = true;
        maxButton.disabled=true;
        icewizardButton.disabled=true;
        leonButton.disabled=true;
        giantButton.disabled=true;
    })
    putonScreen([inst, currentImage, maxButton, icewizardButton, leonButton, giantButton, confirmButton]);
    document.querySelector('section').style.marginTop='auto';
}

function setupTagger(tagger){
    document.querySelector('section').style.marginTop='200px';
    document.querySelector('section').style.color = '#39FF14';
    document.querySelector('section').style.fontSize = '50px';
    document.querySelector('section').style.fontFamily = 'courier new';
    
    i = 0;
    txt = `IT is selected: ${tagger}|_`;
    type();
}

function draw(player, ctx){
    ctx.beginPath();

    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    ctx.fill();    

    if (!player.invis && player.tagger) ctx.fillStyle='red'; 
    else if (!player.invis) ctx.fillStyle = 'white'; // check if the player is invisible
    else ctx.fillStyle = 'rgba(100,100,100,0)';

    // handles username
    ctx.font = 'bold 20px times';
    ctx.fillText(player.username, player.x-player.username.length*4.5, player.y-23);
    ctx.closePath();
}

function countDown(time, txt) {
    var timeleft = time;
    var downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.querySelector("section").innerHTML = txt;
      } else {
        document.querySelector("section").innerHTML = timeleft;
      }
      timeleft -= 1;
    }, 1000);
}

function handlePlayerMovement(){
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
}

function handleKeydown(e){
    switch(e.key){
        case 'a': playerMovement.left = true; break;
        case 'd': playerMovement.right = true; break;
        case 'w': playerMovement.up = true; break;
        case 's': playerMovement.down = true; break;
        case 'ArrowLeft': playerMovement.left = true; break;
        case 'ArrowRight': playerMovement.right = true; break;
        case 'ArrowUp': playerMovement.up = true; break;
        case 'ArrowDown': playerMovement.down = true; break;
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
        case 'ArrowLeft': playerMovement.left = false; break;
        case 'ArrowRight': playerMovement.right = false; break;
        case 'ArrowUp': playerMovement.up = false; break;
        case 'ArrowDown': playerMovement.down = false; break;
    }
}

setInterval(()=>{
    if (inGame) socket.emit('playerMovement', playerMovement);
});