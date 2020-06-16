var memberArray = ['jeon', 'lee','chio'];

console.group('array loop');
var i=0;
while(i<memberArray.length){
    console.log(i +':', memberArray[i]);
    i++;
}
console.groupEnd('array loop');

var memberObject = {
    CEO:'jeon',
    developer:'lee',
    designer:'chio'
}

console.group('object loop');
for(position in memberObject){
    console.log(position+":", memberObject[position]);
}
console.groupEnd('object loop');