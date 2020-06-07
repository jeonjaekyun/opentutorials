var express = require('express');
var fs = require('fs');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var app = express();

//route, routing
//app.get('/',(req,res) => res.send('Hello Wolrd!!'));
app.get('/', function (req, res) {
    fs.readdir('./data', 'utf8', function (err, fileList) {
        var title = 'Welcome!!';
        var description = 'Welcome to Node.js`s World';
        var list = template.list(fileList);
        var html = template.HTML(title, list, `
            <h2>${title}</h2>
            ${description}`,
            `<a href="/create">create</a>`);
        res.send(html);
    });
});

app.get('/page/:pageId', function (req, res) {
    var filteredId = path.parse(req.params.pageId).base;
    console.log(filteredId);
    fs.readFile(`./data/${filteredId}`, function (err, description) {
        fs.readdir(`./data`, 'utf8', function (err, fileList) {
            var title = req.params.pageId;
            var sTitle = sanitizeHtml(title);
            var sDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(fileList);
            var html = template.HTML(title, list,
                `<h2>${sTitle}</h2>
                ${sDescription}`,
                `<a href="/update/${sTitle}">update</a>
                 <form action="/delete" method="POST">
                    <input type="hidden" name="id" value="${sTitle}">
                    <input type="submit" value="delete">
                 </form>
            `);
            res.send(html);
        });
    });
});

app.get('/create', function (req, res) {
    var title = 'WEB - Create';
    var html = template.HTML(title, '', `
        <h2>${title}</h2>
        <form action="/create" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" 
                placeholder="description" cols="100" rows="20"></textarea>
            </p>
            <p>
                <input type="submit" value="등록">
            </p>
        </form>
      `, '');
    res.send(html);
});

app.post('/create', function (req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        console.log(post);
        var title = sanitizeHtml(post.title);
        var description = sanitizeHtml(post.description);
        fs.writeFile(`./data/${title}`, description, 'utf8', function () {
            res.redirect(`/page/${title}`);
        });
    });
});

app.get('/update/:pageId', function (req, res) {
    var filterdId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filterdId}`, 'utf8', function (err, description) {
        var title = req.params.pageId;
        var html = template.HTML(filterdId, '', `
        <h2>${title}</h2>
        <form action="/update" method="POST">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" value="${title}"></p>
            <p>
                <textarea name="description" cols="100" rows="20">${description}</textarea>
            </p>
            <p>
                <input type="submit" value="수정">
            </p>
        </form>`, '');
        res.send(html);
    });
});

app.post('/update', function (req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        fs.rename(`./data/${id}`, `./data/${title}`, function () {
            fs.writeFile(`./data/${title}`, description, 'utf8', function () {
                res.redirect(`/page/${title}`);
            });
        });
    })
});

app.post('/delete', function (req, res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        console.log(id);
        fs.unlink(`./data/${id}`, function () {
            res.redirect('/');
        });
    });
});

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
});