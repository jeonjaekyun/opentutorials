var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

function authIsOwner(request, response){
  var isOwner = false;
  var cookies = {};
  if(request.headers.cookie){
    cookies = cookie.parse(request.headers.cookie);
    isOwner = true;
    //console.log(cookies);
  }else{
    isOwner = false;
  }
  return isOwner;
}

function authStatusUI(request, response){
  var authStatusUI = '<a href="/login">Login</a>';
  if(authIsOwner(request,response)){
    var authStatusUI = '<a href="/logout_process">Logout</a>';
  }
  return authStatusUI;
}

var app = http.createServer(function (request, response) {
  //url.parse는 url에 데이터를 배열 형태로 파싱해준다
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, fileList) {
        title = 'Welcome';
        description = 'Hello, Nodejs';
        var list = template.list(fileList);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`,
          authStatusUI(request,response));
        response.writeHead(200);
        response.end(html);
      });
    } else {
      //사용자가 id 값에 ..을 사용하여도 base로만 받아서 사용하여 사용자의 서버 탐색을 차단한다.
      var filterdId = path.parse(queryData.id).base;
      fs.readFile(`data/${filterdId}`, 'utf8', function (err, description) {
        fs.readdir('./data', function (err, fileList) {
          sanitizeTitle = sanitizeHtml(title);
          sanitizeDescription = sanitizeHtml(description);
          var list = template.list(fileList);
          var html = template.HTML(title, list,
            `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
            `<a href="/create">create</a> 
             <a href="/update?id=${sanitizeTitle}">update</a>
             <form action="delete_process" method="POST">
              <input type="hidden" name="id" value="${sanitizeTitle}">
              <input type="submit" value="delete">
             </form>`,
             authStatusUI(request,response));
          response.writeHead(200);
          response.end(html);
        });

      });
    }

  } else if (pathname === '/create') {
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }

    fs.readdir('./data', function (err, fileList) {
      title = 'WEB - Create';
      var list = template.list(fileList);
      var html = template.HTML(title, list, `
        <h2>${title}</h2>
        <form action="/create_process" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" 
                placeholder="description" cols="100" rows="20"></textarea>
            </p>
            <p>
                <input type="submit" value="등록">
            </p>
        </form>
      `, '',authStatusUI(request,response));
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }
    
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      console.log(post);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end('sucess');
      });
    });
  } else if (pathname === '/update') {
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }
    
    var filterdId = path.parse(queryData.id).base;
    fs.readFile(`./data/${filterdId}`, 'utf8', function (err, description) {
      var html = template.HTML(title, '', `
        <h2>${title}</h2>
        <form action="/update_process" method="POST">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" value="${title}"></p>
            <p>
                <textarea name="description" cols="100" rows="20">${description}</textarea>
            </p>
            <p>
                <input type="submit" value="수정">
            </p>
        </form>
      `, '',authStatusUI(request,response));
      response.end(html);
    });
  } else if (pathname === '/update_process') {
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }
    
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      console.log(body);
      //body는 QureyString 형태이다 ex)id=Reactjs&title=Reactjs
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
        //${title}이 ../test 형태로 들어 온다면? path.parse(var).base로 받아온다.
        //File이 아닌 DB를 사용하여서 해결?
        fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end('sucess');
        });
      });
    });
  } else if (pathname === "/delete_process") {
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }
    
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filterdId = path.parse(id).base;
      fs.unlink(`./data/${filterdId}`, function (err) {
        response.writeHead(302, { Location: "/" });
        response.end('sucess');
      });
    });
  } else if (pathname === '/login') {
    fs.readdir('./data', function (err, fileList) {
      title = 'Welcome';
      description = 'Hello, Nodejs';
      var list = template.list(fileList);
      var html = template.HTML(title, list,
        `
          <h2>Login</h2>
          <form action="/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="login"></p>
          </form>
          `,
        ``);
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/login_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      
      if(post.email==='jeon@gmail.com' && post.password === '1234'){
        response.writeHead(302,{
          'Set-Cookie':[
            `email=${post.email}`,
            `password=${post.password}`,
            `nickname=jeon`
          ],
          Location:'/'
        });
        response.end();
      }else{
        response.end('Who??');
      }
    });
  }else if(pathname === '/logout_process'){
    if(authIsOwner(request,response)===false){
      response.end('Login required!!');
      return false;
    }
    
    response.writeHead(302,{
      'Set-cookie':[
        'email=; Max-age=0',
        'password=; Max-age=0',
        'nickname=; Max-age=0'
      ],
      Location:'/'
    });
    response.end();
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }

});
app.listen(3000);