function fn(person){
    person = Object.assign({},person);
    person.name = 'lee';
    return person;
}

var o1 = {name:'park'};
var o2 = fn(o1);

console.log(o1,o2,o1===o2);