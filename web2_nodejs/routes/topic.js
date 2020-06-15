var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');
var path = require('path');

router.get('/create', function (req, res) {
    if(auth.isOwner(req,res)===false){
        res.redirect('/');
        return false;
    }
    var title = 'WEB - Create';
    var html = template.HTML(title, '', `
        <h2>${title}</h2>
        <form action="/topic/create" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" 
                placeholder="description" cols="100" rows="20"></textarea>
            </p>
            <p>
                <input type="submit" value="등록">
            </p>
        </form>
      `, '',auth.statusUI(req,res));
    res.send(html);
});

router.post('/create', function (req, res) {
    if(auth.isOwner(req,res)===false){
        res.redirect('/');
        return false;
    }
    var post = req.body;
    console.log(post);
    var title = sanitizeHtml(post.title);
    var description = sanitizeHtml(post.description);
    fs.writeFile(`./data/${title}`, description, 'utf8', function () {
        res.redirect(`/topic/${title}`);
    });
});

router.get('/update/:pageId', function (req, res) {
    if(auth.isOwner(req,res)===false){
        res.redirect('/');
        return false;
    }
    var filterdId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filterdId}`, 'utf8', function (err, description) {
        
        var title = req.params.pageId;
        var html = template.HTML(filterdId, '', `
                <h2>${title}</h2>
                <form action="/topic/update" method="POST">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" value="${title}"></p>
                    <p>
                        <textarea name="description" cols="100" rows="20">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="수정">
                    </p>
                </form>`, '',auth.statusUI(req,res));
        res.send(html);

    });
});

router.post('/update', function (req, res) {
    if(auth.isOwner(req,res)===false){
        res.redirect('/');
        return false;
    }
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;

    fs.rename(`./data/${id}`, `./data/${title}`, function () {
        fs.writeFile(`./data/${title}`, description, 'utf8', function () {
            res.redirect(`/topic/${title}`);
        });
    });
});

router.post('/delete', function (req, res) {
    if(auth.isOwner(req,res)===false){
        res.redirect('/');
        return false;
    }
    var post = req.body;
    console.log(post);
    var id = post.id;
    console.log(id);
    fs.unlink(`./data/${id}`, function () {
        res.redirect('/');
    });
});

router.get('/:pageId', function (req, res, next) {
    var filteredId = path.parse(req.params.pageId).base;
    console.log(filteredId);
    fs.readFile(`./data/${filteredId}`, function (err, description) {
        if(err){
            next(err);
        }else{
            var title = req.params.pageId;
            var sTitle = sanitizeHtml(title);
            var sDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(req.list);
            var html = template.HTML(title, list,
                `<h2>${sTitle}</h2>
                    ${sDescription}`,
                `<a href="/topic/update/${sTitle}">update</a>
                    <form action="/topic/delete" method="POST">
                        <input type="hidden" name="id" value="${sTitle}">
                        <input type="submit" value="delete">
                    </form>
                `,auth.statusUI(req,res));
            res.send(html);
        }
    });

});

module.exports = router;