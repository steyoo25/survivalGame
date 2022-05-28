let gameState = {
    players: {}
}

class Player {
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.xVel = 4;
        this.yVel = 4;
    }
}

module.exports = {gameState, Player};