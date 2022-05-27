let gameState = {
    players: {}
}

class Player {
    constructor(x, y, width, height, color, ability){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.xVel = 4;
        this.yVel = 4;
        this.abilityLeft = 3; // how many times this player can use this ability;
        this.usingAbility = false;
        this.ability = ability;
    }

    useAbilityCheck(){
        if (this.abilityLeft > 0 && !this.usingAbility){
            return true;
        }
        return false;
    }

    useAbility(){
        let cooldown = 3000;
        this.usingAbility = true;
        this.abilityLeft --;
        switch (this.ability){
            case 'speed':
                this.xVel = 20;
                this.yVel = 20;
                setTimeout(() => {
                    this.xVel = 4;
                    this.yVel = 4; 
                    this.usingAbility = false;
                }, cooldown); // 3000 seconds after
                break;
            case 'big':
                this.width = 100;
                this.height = 100;
                setTimeout(() => {
                    this.width = 25;
                    this.height = 25;
                    this.usingAbility = false;
                }, cooldown);
                break;
        }
    }
}

module.exports = {gameState, Player};