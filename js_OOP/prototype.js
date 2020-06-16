function Person(name, height, weight){
    this.name = name;
    this.height = height;
    this.weight = weight;
}

Person.prototype.BMI = function(){
    bmi = this.weight / (this.height*this.height) * 10000
    return Math.round(bmi);
}

Person.prototype.num = 0;

//prototype을 통해 생성자에서 공용으로 사용하는 함수를 지정할 수 있다.
var jeon = new Person('jeon',177,75);
var lee = new Person('lee',175,70);
var num = Person.prototype.num;

console.log(++num + '번 고객' + ' 이름 : ' + jeon.name + ' BMI : '+jeon.BMI());
console.log(++num + '번 고객' + ' 이름 : ' + lee.name + ' BMI : '+lee.BMI());
console.log('Person():',Person());
//new Person("park",183,80): Person { name: 'park', height: 183, weight: 80 }가
//결과로 나오므로 BMI()는 사용될때만 생성된다고 할 수 있다.
console.log('new Person("park",183,80):',new Person("park",183,80));