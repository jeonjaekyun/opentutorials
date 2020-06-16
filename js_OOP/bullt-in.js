console.group('Math object');
console.log('Math.PI :', Math.PI);
console.log('Math.ramdom() :', Math.random());
console.log('Math.ceil(3.3) :', Math.ceil(3.3));
console.groupEnd('Math object');

var MyMath = {
    PI:Math.PI,
    random:function(){
        return Math.random();
    },
    ceil:function(val){
        return Math.ceil(val);
    }
}

console.group('MyMath object');
console.log('MyMath.PI :', MyMath.PI);
console.log('MyMath.ramdom() :', MyMath.random());
console.log('MyMath.ceil(3.3) :', MyMath.ceil(3.3));
console.groupEnd('MyMath object');