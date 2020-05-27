var members = ['egoing','k8805', 'hoya'];

members.forEach(function(string,idx){
    console.log(`${idx} : `+string);
});

members.forEach((str,idx)=>{
    console.log(`${idx} : `+str);
});

for(idx in members){
    console.log(members[idx]);
}

var roles = {
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'hoya'
}

for(key in roles){
    console.log(`${key} : ${roles[key]}`);
}

console.log(roles.programmer);