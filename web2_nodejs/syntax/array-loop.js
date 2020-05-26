var number = [1,400,12,34,5];
var i = 0;
var tot = 0;
number.forEach((num, idx,arr)=>{
    console.log(`number[${idx}] : ${num}`);
});

while(i<number.length){
    tot+=number[i];
    i+=1;
}

console.log(`tot : ${tot}`);
