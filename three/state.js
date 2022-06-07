let gameState = {
    players: {},
}

class Player {
    constructor(username, x,y, spec){
        this.username = username;
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.xVel = 4;
        this.yVel = 4;
        this.usingSuper = false;
        this.superLeft = 3;
        this.immune = false;
        this.shield = false;
        this.duration = 3000;
        this.cooldown = 5000;
        this.spec = spec;
    }

    // draw() {
    //     ctx.beginPath();
    //     ctx.fillStyle = this.color;
    //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    //     ctx.fill();
    //     ctx.closePath();
    // }

    checkSuper() {
        if (!this.usingSuper && this.superLeft > 0 && !this.spec)
            return true;
        return false;
    }

}

class Max extends Player { // superspeed character
    constructor(username, x,y, spec){
        super(username, x,y, spec);
        this.color = 'yellow';
    }

    useSuper(){
        this.superLeft --;
        this.usingSuper = true;
        this.xVel = 15;
        this.yVel = 15;
        // 5 lines below turns the player color to white for a split second
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(()=>{
            this.color = originalColor;
        }, 500);
        setTimeout(()=>{
            this.xVel = 4;
            this.yVel = 4;
            setTimeout(()=>{
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration);
    }
    
}

class IceWizard extends Player{ // slows everyone down
    constructor(username, x,y, spec){
        super(username, x,y, spec);
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
                affectedPlayer.xVel = 1;
                affectedPlayer.yVel = 1;
                let originalColor = affectedPlayer.color;
                affectedPlayer.color = 'pink';
                affectedPlayer.usingSuper = true;
                setTimeout(()=>{
                    this.immune = false;
                    affectedPlayer.xVel = 4;
                    affectedPlayer.yVel = 4;
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
    constructor(username, x,y, spec){
        super(username, x,y, spec);
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
            this.xVel = 6;
            this.yVel = 6; // adds a little bit of boost in speed!
        }, 500);
        setTimeout(() => {
            this.invis = false;
            this.color = originalColor;
            this.xVel = 4;
            this.yVel = 4;
            setTimeout(() => {
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration);
    }
}

class Rosa extends Player {
    constructor(username, x,y, spec){
        super(username, x,y, spec);
        this.color = 'orange';
    }

    useSuper() {
        this.superLeft --;
        this.usingSuper = true;
        let originalColor = this.color;
        this.color = 'white';
        setTimeout(() => {
            this.color = 'red';
        }, 500);
        this.shield = true; // having shield makes it immune to obstacles
        setTimeout(()=>{
            this.color = originalColor;
            this.shield = false;
            setTimeout(() => {
                this.usingSuper = false;
            }, this.cooldown);
        }, this.duration )
    }
}

module.exports = {gameState, Max, IceWizard, Leon, Rosa};