var http = require('http');
var url = require('url');
var fs = require('fs');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    console.log(pathname);
    console.log(queryData.id);

    if (pathname === '/') {
        if(queryData.id === undefined){
            var title = 'Welcome';
            var description = 'Welcome to WEB';
            fs.readdir('./data','utf8',function(err, fileList){
                var list = `<ol>`;
                fileList.forEach(function(file){
                    console.log(file);
                    list += `<li><a href="/?id=${file}">${file}</a></li>`
                });
                list += '</ol>';
                console.log(list);
                var template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>
                        ${description}
                    </p>
                    </body>
                    </html>
                    `
                response.writeHead(200);
                response.end(template);
            });
        }else{
            title = queryData.id;
            fs.readFile(`./data/${title}`,'utf8',function(err, description){
                fs.readdir('./data','utf8',function(err, fileList){
                    var list = `<ol>`;
                    fileList.forEach(function(file){
                        console.log(file);
                        list += `<li><a href="/?id=${file}">${file}</a></li>`
                    });
                    list += '</ol>';
                    console.log(list);
                    var template = `
                        <!doctype html>
                        <html>
                        <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>
                            ${description}
                        </p>
                        </body>
                        </html>
                        `
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }else{
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);