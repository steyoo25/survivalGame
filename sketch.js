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
   ellipse(x, y, 50, 50);
}

function keyPressed() {

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    x += 5;
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    x -= 5;
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    y -= 5;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    y += 5;
  }


}