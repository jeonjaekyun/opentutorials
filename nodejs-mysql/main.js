var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host:'localhost',
  user:'jm',
  password:'jm1234',
  database:'opentutorials'
});
db.connect();

var app = http.createServer(function (request, response) {
  //url.parse는 url에 데이터를 배열 형태로 파싱해준다
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      db.query("select * from topic",function(err,topics){
        if(err){
          console.log(err);
        }
        title = 'Welcome';
        description = 'Hello, Nodejs';
        var list = template.list(topics);
        console.log(list);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query(`select * from topic`,function(err, topics){
        if(err) throw err;
        //보안을 위해 ?를 사용한다.
        db.query(`select * from topic where id=?`,[queryData.id], function(err2, topic){
          if(err2) throw err2;
          title = topic[0].title;
          description = topic[0].description;
          id = topic[0].id;

          list = template.list(topics);
          html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/update?id=${id}">update</a>
          <form action="delete_process" method="POST">
           <input type="hidden" name="id" value="${id}">
           <input type="submit" value="delete">
          </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, fileList) {
      title = 'WEB - Create';
      var html = template.HTML(title, '', `
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

      db.query(`insert into topic(title, description, created, author_id) 
      values(?,?,now(),?)`,[title, description,1],function(err,results){
        if(err) throw err;
        response.writeHead(302, { Location: `/?id=${results.insertId}` });
        response.end('sucess');
      });
    });
  } else if(pathname === '/update'){
    db.query('select * from topic where id=?',[queryData.id],function(err, topic){
      if(err) throw err;
      var html = template.HTML(topic[0].title, '', `
      <h2>${topic[0].title}</h2>
      <form action="/update_process" method="POST">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" value="${topic[0].title}"></p>
          <p>
              <textarea name="description" cols="100" rows="20">${topic[0].description}</textarea>
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
      console.log(post);
      db.query('update topic set title=?, description=? where id=?',
        [title,description,id],function(err,results){

          if(err) throw err;

          response.writeHead(302, { Location: `/?id=${id}` });
          response.end('sucess');
      });
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