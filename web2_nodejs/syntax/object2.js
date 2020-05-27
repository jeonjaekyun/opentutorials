//JavaScript에서는 function이 값이 될수 있다.
var f = function(){
    console.log(1+1);
    console.log(1+2);
}

console.log(f);

var a = [f];
a[0]();

var o = {
    func:f
}
o.func();