function Person(name, height, weight){
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.BMI = function(){
        bmi = this.weight / (this.height*this.height) * 10000
        return Math.round(bmi);
    }
}

var jeon = new Person('jeon',177,75);
var lee = new Person('lee',175,70);

console.log('jeon.BMI() :',jeon.BMI());
console.log('lee.BMI() :',lee.BMI());
console.log('Person():',Person());
console.log('new Person("park",183,80):',new Person("park",183,80));