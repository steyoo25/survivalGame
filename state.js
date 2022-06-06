let gameState = {
    players: {}
}

class Player {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.xVel = 4;
        this.yVel = 4;
        this.radius = radius;
        this.currentScreen = 'MENU';
    }
}

module.exports = {gameState, Player};