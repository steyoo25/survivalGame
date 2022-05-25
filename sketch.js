let x=300
let y=300
let MENU = 0
function setup() {
    createCanvas(600, 600)
    //bg = loadImage('') //background
   
}

function draw() {
    //image(bg, 0, 0)

    background(225)
    fill(255, 255, 255);
    rect(200, 100, 200, 75); 
    fill(255, 255, 255);
    rect(200, 250, 200, 75);
    fill(255, 255, 255);
    rect(200, 400, 200, 75);
    textSize(50)
    fill(0)
    text('PLAY', 237, 155);
    fill(0)
    text('empty', 236, 300); //changeable
    textSize(35);
    fill(0)
    text('How to Play', 207, 450);
  
    if (MENU === 1) {
        background(225)
        game()
        if (keyIsDown(77)) {
          MENU = 0
        }
      } // START GAME
      if (MENU === 2) {

        if (keyIsDown(77)) {
          MENU = 0
        }
      } // INSTRUCTIONS
      if (MENU === 3) {
        
        if (keyIsDown(77)) {
            MENU = 0
          }
      } 
    }
      



function mouseClicked() {
    if (MENU == 0) {
        if (mouseX > 200 && mouseX < 400) {
            if (mouseY > 100 && mouseY < 175) {
                MENU = 1
            }
            if (mouseY > 250 && mouseY < 325) {
                MENU = 2
            }
            if (mouseY > 400 && mouseY < 475) {
                MENU = 3
            }
        }
    }
}


function game() {
    keyPressed()
    fill(255,255,255)
    ellipse(x, y, 50, 50);
}

function keyPressed() {
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        if (x < 575)
            x += 5;
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        if (x > 25)    
            x -= 5;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        if (y > 25)
            y -= 5;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        if (y < 575)
            y += 5;
    }
}