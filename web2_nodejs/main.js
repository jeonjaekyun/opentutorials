var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

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
          `<a href="/create">create</a>`);
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
             </form>`);
          response.writeHead(200);
          response.end(html);
        });

      });
    }

  } else if (pathname === '/create') {
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
      `,'');
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
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
  } else if(pathname === '/update'){
    var filterdId = path.parse(queryData.id).base;
    fs.readFile(`./data/${filterdId}`,'utf8',function(err,description){
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
      `,'');
      response.end(html);
    });
  }else if(pathname === '/update_process'){
    var body = "";
    request.on('data', function(data){
      body += data;
    });
    request.on('end',function(){
      console.log(body);
      //body는 QureyString 형태이다 ex)id=Reactjs&title=Reactjs
      var post = qs.parse(body);
      var id  = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`./data/${id}`,`./data/${title}`,function(err){
        //${title}이 ../test 형태로 들어 온다면?
        fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end('sucess');
        });
      });
      console.log(post);
    });
  }else if(pathname === "/delete_process"){
    var body = "";
    request.on('data', function(data){
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var id  = post.id;
      var filterdId = path.parse(id).base;
      fs.unlink(`./data/${filterdId}`,function(err){
        response.writeHead(302, { Location: "/" });
        response.end('sucess');
      });
      console.log(post);
    });
  }else {
    response.writeHead(404);
    response.end('Not Found');
  }

});
app.listen(3000);