const o1 = {name:'kim'};
Object.freeze(o1);
const o2 = {name:'lee'};
//o1=o2; Error 객체 const의 주소 값을 변경할 수 없다.
//o1.name = 'park' freeze한 객체의 property는 바꿀 수 없다.