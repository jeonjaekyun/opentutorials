function plus(a,b,callback){
    var sum = a+b;
    callback(sum);
}

plus(1,2,function(result){
    console.log(result);
});