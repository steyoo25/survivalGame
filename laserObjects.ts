class Laser {
    
    //List all properties:
    m : number; // m: [0,1)
    b : number;
    type : number; // type: [0,1]

    /*
    type 1: y = mx+b
    type 2: y = -mx+b
    type 3: x = my+b
    type 4: x = -my+b
    */

    constructor(m : number, b : number, type : number) {
        //set up properties
        this.m = m;
        this.b = b;
        this.type = type
    }

    draw() : void {

    }

    update() : void {
        
    }

    findLength() : number {
        //too lazy rn ngl
        return 
    }
}
