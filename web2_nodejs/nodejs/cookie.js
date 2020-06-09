var http = require('http');
var cookie = require('cookie');

http.createServer(function(req,res){
    var cookies = {};
    if(req.headers.cookie !== undefined){
        cookies = cookie.parse(req.headers.cookie);
    }
    console.log(cookies);
    res.writeHead(200,{
       'Set-Cookie':[
           'yummy_cookie=choco',
           'tasty_cookie=strawberry',
           `Parmanet=parmanet; Max-age=${60*60*24}`, // Parmanet cookie cookie의 유지 시간을 설정
           'Secure=secure; Secure', // Https에서만 사용가능한 cookie
           'HttpOnly=httpOnly; HttpOnly', //브라우저 통신에서만 사용하는 cookie(javaScript로 접근 불가)
           'Path=path; Path=/cookie', //특정 path에서만 cookie가 존재
           'Domain=domain; Domain=o2.org' //특정 domain에서만 cookie가 존재
        ],
    });
    res.end('Cookie!!');
}).listen(3000);