let gameState = {
    players: {},
}

class Player {
    constructor(username, x,y){
        this.username = username;
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.xVel = 1.5;
        this.yVel = 1.5;
        this.usingSuper = false;
        this.superLeft = 3;
        this.immune = false;
        this.duration = 3000;
        this.cooldown = 5000;
        this.touching = false;
        this.tagger = false;
        this.points = 0;
        this.canTag = true;
    }

    checkSuper() {
        if (!this.usingSuper && this.superLeft > 0)
            return true;
        return false;
    }

}

class Normal extends Player {
    constructor(username, x,y){
        super(username, x,y);
        this.color = '#E0AC69';
    }
    useSuper(){
        this.superLeft--;
        this.usingSuper=true;
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(()=>{
            this.color = originalColor;
        }, 500);
        setTimeout(()=>{
            this.xVel = 1.5;
            this.yVel = 1.5;
            setTimeout(()=>{
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration);
    }
}

class Max extends Player { // superspeed character
    constructor(username, x,y){
        super(username, x,y);
        this.color = 'yellow';
    }

    useSuper(){
        this.superLeft --;
        this.usingSuper = true;
        this.xVel = 5;
        this.yVel = 5;
        // 5 lines below turns the player color to white for a split second
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(()=>{
            this.color = originalColor;
        }, 500);
        setTimeout(()=>{
            this.xVel = 1.5;
            this.yVel = 1.5;
            setTimeout(()=>{
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration);
    }
    
}

class IceWizard extends Player{ // slows everyone down
    constructor(username, x,y){
        super(username, x,y);
        this.color = 'cyan';
        // make sure to change this.cooldown down later, or this will be too op. 
    }

    useSuper(){
        this.immune = true;
        this.superLeft --;
        this.usingSuper = true;
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(()=>{
            this.color = originalColor;
        }, 500);
        for (const i in gameState.players) {
            let affectedPlayer = gameState.players[i];
            if (!affectedPlayer.immune){ // loops thru every other player
                affectedPlayer.xVel = 0.5;
                affectedPlayer.yVel = 0.5;
                let originalColor = affectedPlayer.color;
                affectedPlayer.color = 'pink';
                affectedPlayer.usingSuper = true;
                setTimeout(()=>{
                    this.immune = false;
                    affectedPlayer.xVel = 1.5;
                    affectedPlayer.yVel = 1.5;
                    affectedPlayer.color = originalColor;
                    affectedPlayer.usingSuper = false;
                    setTimeout(()=>{
                        this.usingSuper = false;
                    }, this.cooldown)
                }, this.duration);
            }   
        }
    }
}

class Leon extends Player { // invisbility
    constructor(username, x,y){
        super(username, x,y);
        this.color = 'purple';
        this.invis = false;
    }

    useSuper() {
        this.superLeft --;
        this.usingSuper = true;
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(()=>{
            this.invis = true;
            // transparent : 'rgba(100,100,100,0)' 
            this.color = 'rgba(100,100,100,0)';
            this.xVel = 3;
            this.yVel = 3; // adds a little bit of boost in speed!
        }, 500);
        setTimeout(() => {
            this.invis = false;
            this.color = originalColor;
            this.xVel = 1.5;
            this.yVel = 1.5;
            setTimeout(() => {
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration);
    }
}

class Giant extends Player {
    constructor(username, x,y){
        super(username, x,y);
        this.color = 'orange';
    }

    useSuper() {
        this.superLeft --;
        this.usingSuper = true;
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(() => {
            this.color = originalColor;
        }, 500);
        this.radius = 55; // becomes big
        this.xVel = 1;
        this.yVel = 1; // becomes a little slower
        setTimeout(()=>{
            this.radius = 20;
            this.xVel = 1.5;
            this.yVel = 1.5;
            setTimeout(() => {
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration )
    }
}

module.exports = {gameState, Normal, Max, IceWizard, Leon, Giant};