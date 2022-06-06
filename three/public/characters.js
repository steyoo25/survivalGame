const socket = io();
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let index = 0;

characters = ['Max', 'IceWizard', 'Leon', 'Rosa']
currentCharacter = characters[0];

canvas.width = 800;
canvas.height = 500;

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let text = '';
    switch (currentCharacter){
        case 'Max':
            ctx.fillStyle = 'yellow';
            text = 'Max';
            break; 
        case 'IceWizard':
            ctx.fillStyle = 'cyan';
            text = 'IceWizard'
            break;
        case 'Leon':
            ctx.fillStyle = 'purple';
            text = 'Leon';
            break;
        case 'Rosa':
            ctx.fillStyle = 'orange';
            text = 'Rosa';
            break;
    }
    ctx.beginPath();        
    ctx.arc(canvas.width/2, canvas.height/2, 60, 0, Math.PI*2);
    ctx.fill();
    ctx.font = '50px sherif';
    ctx.fillText(text, canvas.width/2-50, canvas.height/2+120, 200);
    ctx.closePath();
}

let chosenCharacter;

function handleArrowLeftArrowRight(e){
    if (index >= 0 && index < characters.length){
        if ((e.key==='ArrowLeft' || e.key==='q') && index > 0){
            index --;
            currentCharacter = characters[index];
        } else if ((e.key==='ArrowRight' || e.key==='e') && index < characters.length-1){
            index ++;
            currentCharacter = characters[index];
        } else if (e.key===' '){
            chosenCharacter = characters[index];
            sessionStorage.setItem('character', chosenCharacter);
            window.location.href='./game.html';
        }
    }
}

document.addEventListener('keydown', handleArrowLeftArrowRight);

setInterval(draw, 1000/60);