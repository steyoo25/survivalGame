x=0
y=0
function setup() {
    createCanvas(600, 600)
    bg = loadImage('') //background
    char = ellipse(x+200, y+250, 50, 50);

}

function draw() {
   //image(bg, 0, 0)
   background(225)
   char.draw()
}