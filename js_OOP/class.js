class Person{
    constructor(name, first, second){
        this.name = name;
        this.first = first;
        this.second = second;
    }
    sum(){
        return this.first + this.second;
    }
}

class PersonPlus extends Person{
    constructor(name, first, second, third){
        super(name, first, second);
        this.third=third;
    }

    sum(){
        return super.sum()+this.third;
    }

    avg(){
        return parseInt((super.sum() + this.third)/3);
    }
}

var jeon = new Person('jeon',10,20);
var lee = new Person('lee',30,40);
var park = new PersonPlus('park',20,40,50);

console.log('jeon.sum()',jeon.sum());
console.log('lee.sum()',lee.sum());
console.log('park.sum()',park.sum());
console.log('park.avg()',park.avg());
