var kim = {name:'kim', first:10, second:20};
var lee = {name:'lee', first:10, second:10};
var sum = function(prefix){
    return prefix + (this.first + this.second);
}

//call의 첫번째 인자로 들어가는 객체는 함수에서 this의 역할을 한다.
//call의 두번째 인자부터 함수의 parameter 값이 들어온다
console.log('sum.call(kim)',sum.call(kim,' => '));
console.log('sum.call(lee)',sum.call(lee,' = '));

//var kimSum = sum.call(kim," - ");
//console.log('kimSum()',kimSum());
var leeSum = sum.bind(lee,' = ');
console.log('leeSum()',leeSum());

//bind는 리턴 값으로 객체를 주고 call은 리턴 값으로 함수의 결과 값을 준다.