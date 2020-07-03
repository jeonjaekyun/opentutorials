var o1 = {name:'kim'};
var o2 = Object.assign({},o1);
console.log(o1,o2,o1===o2); //o1과 o2는 다른 주소를 가리킨다.
o2.name = 'lee';
console.log(o1,o2,o1===o2);