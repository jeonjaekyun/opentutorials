var memberArray = ['jeon', 'lee','chio'];
var memberObject = {
    CEO:'jeon',
    developer:'lee',
    designer:'chio'
}

memberObject.designer = 'choi';
console.log('memberArray[2] :',memberArray[2]);
console.log('memberObject.designer :',memberObject.designer);
delete memberObject.designer;
console.log('memberObject.designer :',memberObject.designer);