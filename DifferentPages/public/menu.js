let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Button {
    constructor(x, y, w, h, color, text){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.text = text;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.font = '30px sherif'
        ctx.fillStyle = 'red';
        ctx.fillText(this.text, this.x+50, this.y+50, 200);
        ctx.closePath();
    }
}

let playButton = new Button(canvas.width/2-100, canvas.height/3, 200, 75, 'white', 'PLAY');
let characterButton = new Button(canvas.width/2-100, canvas.height/2, 200, 75, 'white', 'Characters');
let howToPlayButton = new Button(canvas.width/2-100, 2*canvas.height/3, 200, 75, 'white', 'How to Play');

let buttonList = [playButton, characterButton, howToPlayButton];

function draw(){
    for (const button of buttonList){
        button.draw();
    }
}

setInterval(draw, 1000/60);

document.addEventListener('click', (e)=>{
    if (e.offsetX>=playButton.x && e.offsetX<=playButton.x+playButton.w && e.offsetY>=playButton.y && e.offsetY<=playButton.y+playButton.h){
        window.location.href = './game.html';
    }
})