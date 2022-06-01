let canvas = document.querySelector as HTMLCanvasElement
let ctx = canvas.getContext("2d")

class Laser {
    
    //List all properties:
    m : number; // m: [0,1)
    b : number;
    type : number; // type: [0,1]
    speed : number;

    /*
    type 1: y-150 = m(x-150)+b
    type 2: y = -mx+b
    type 3: x = my+b
    type 4: x = -my+b
    */

    constructor(m : number, b : number, type : number, speed : number) {
        //set up properties
        this.m = m;
        this.b = b;
        this.type = type
        this.speed = speed
    }

    draw() : void {
        ctx.beginPath

        ctx.closePath
    }

    update() : void {
        
    }

    // findLength() : number {
    //     //too lazy rn ngl
    //     return 
    // }

    findPosToGraph() : Array<Array<Number>> {
        
        return 
    }
}
