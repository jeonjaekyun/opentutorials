// function a(){
//     console.log('A');
// }

//Javascript에서는 함수를 변수에 대입할 수 있다.
var a = function() {
    console.log('A');
}

function slowfunc(callback){
    callback();
}

slowfunc(a);