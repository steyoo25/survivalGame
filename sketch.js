let x=300
let y=300
function setup() {
    createCanvas(600, 600)
    //bg = loadImage('') //background
   
}

function draw() {
   //image(bg, 0, 0)
   background(225)
   keyPressed()
   clear()
   ellipse(x, y, 50, 50);
}

function keyPressed() {

  if (keyIsDown(RIGHT_ARROW) || keyIsDown("a")) {
    x += 10;
  }

  if (keyIsDown(LEFT_ARROW) || keyPressed("d")) {
    x -= 10;
  }

  if (keyIsDown(UP_ARROW) || keyIsDown("w")) {
    y -= 10;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown("s")) {
    y += 10;
  }


}