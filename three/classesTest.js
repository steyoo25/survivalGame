class Player {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.hello = false;
    }

    sayHello(){
        console.log('ehllo')
    }
}

class Person extends Player{
    constructor(x,y){
        super(x,y);
    }
}

let me = new Person(1,1);
console.log(me.sayHello());