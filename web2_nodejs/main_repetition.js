var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');

var template = {
    list: function (fileList) {
        var list = `<ol>`;
        fileList.forEach(function (file) {
            console.log(file);
            list += `<li><a href="/?id=${file}">${file}</a></li>`
        });
        list += '</ol>';
        return list;
    }, HTML: function (title, list, control, body) {
        return `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
            </body>
            </html>
            `
    }
};

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    console.log(pathname);
    console.log(queryData.id);
    
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', 'utf8', function (err, fileList) {
                var title = 'Welcome';
                var description = 'Welcome to WEB';
                var list = template.list(fileList);
                console.log(list);
                var html = template.HTML(title, list,
                    `<a href="/create">create</a>`,
                    `<p><h2>${title}</h2></p>
                     <p>${description}</p>
                    `);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            title = queryData.id;
            var filteredId = path.parse(title).base;
            console.log(filteredId);
            fs.readFile(`./data/${filteredId}`, 'utf8', function (err, description) {
                fs.readdir('./data', 'utf8', function (err, fileList) {
                    var list = template.list(fileList);
                    console.log(list);
                    var html = template.HTML(title, list,
                        `<a href="/update?id=${filteredId}">update</a>
                        <form action="/delete_process" method="post">
                        <input type="hidden" name="title" value="${filteredId}">
                        <input type="submit" value="delete">
                        </form>`,
                        `<h2>${title}</h2>
                        <p>${description}</p>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        var title = 'create';
        var html = template.HTML(title, '','',
            `<form action="/create_process" method="post">
            <h3>Title</h3>
            <input type="text" name="title">
            <h3>Description</h3>
            <textarea name="description" rows="10" cols="50"></textarea><br><br>
            <input type="submit">
            </form>`);
        response.writeHead(200);
        response.end(html);
    } else if (pathname === '/create_process') {
        var body = "";
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            title = post.title;
            description = post.description;
            filteredId = path.parse(title).base;
            console.log(filteredId);
            console.log(post);
            fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end('sucess');
            });
        });
    } else if (pathname === '/update') {
        title = queryData.id;
        console.log(title);
        fs.readFile(`./data/${title}`, 'utf8', function (err, description) {
            var html = template.HTML(title,'','',
            `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <h2>TITLE</h2>
            <p>
                <input type="text" name="title" value="${title}">
            </p>
            <h2>Description</>
            <p>
            <textarea name="description" rows="10" cols="50">${description}</textarea>
            </p>
            <input type="submit">
            </form>
            `);
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/update_process') {
        var body = "";
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            console.log(post);
            id = post.id;
            title = post.title;
            description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
                fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
                    response.writeHead(302, { Location: `./?id=${title}` });
                    response.end('success');
                });
            });
        });
    } else if (pathname === '/delete_process') {
        body = "";
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            post = qs.parse(body);
            title = post.title;
            console.log(post);
            console.log(title);
            fs.unlink(`./data/${title}`, function (err) {
                response.writeHead(302, { Location: `./` });
                response.end('success');
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);