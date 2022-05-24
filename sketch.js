let x=300
let y=300
function setup() {
    createCanvas(600, 600)
    //bg = loadImage('') //background
   
}

function draw() {
    //image(bg, 0, 0)
    background(225)
    keyPressed();
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