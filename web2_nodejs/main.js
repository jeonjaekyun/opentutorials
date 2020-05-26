var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB2 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </p>
  </body>
  </html>    
  `;
}

function fileListPrint(fileList) {
  var list = '<ul>';
  fileList.forEach(function (file) {
    list = list + `<li><a href="/?id=${file}">${file}</a></li>`
  });
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, fileList) {
        title = 'Welcome';
        description = 'Hello, Nodejs';
        var list = fileListPrint(fileList);
        var template = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        fs.readdir('./data', function (err, fileList) {
          var list = fileListPrint(fileList);
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });

      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, fileList) {
      title = 'WEB - Create';
      var list = fileListPrint(fileList);
      var template = templateHTML(title, list, `
        <h2>${title}</h2>
        <form action="http://localhost:3000/create_process" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" 
                placeholder="description" cols="100" rows="20"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
      `,'');
      response.writeHead(200);
      response.end(template);
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
    fs.readFile(`./data/${queryData.id}`,'utf8',function(err,description){
      var template = templateHTML(title, '', `
        <h2>${title}</h2>
        <form action="http://localhost:3000/create_process" method="POST">
            <p><input type="text" name="title" value="${title}"></p>
            <p>
                <textarea name="description" cols="100" rows="20">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
      `,'');
      response.end(template);
    });
  }else {
    response.writeHead(404);
    response.end('Not Found');
  }

});
app.listen(3000);