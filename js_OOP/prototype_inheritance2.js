var kim = {
    name:'kim',
    first:10, second:20,
    sum:function(){
        return this.first+this.second;
    }
}
var lee = Object.create(kim);
lee.name = 'lee';
lee.first = 10;
lee.second = 10;
lee.avg = function(){
    return (this.first+this.second) / 2;
}

console.log('lee.sum() :',lee.sum());
console.log('lee.avg() :',lee.avg());