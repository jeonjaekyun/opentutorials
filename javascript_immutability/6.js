var o1 ={name:'kim',score:[1,2]}
Object.freeze(o1);
Object.freeze(o1.score); //freeze는 기본적으로 객체의 속성까지만 얼려버린다.(nested Object는 불가)
o1.name='lee';
o1.city='seoul';
//o1.score.push(3); Error
console.log(o1);