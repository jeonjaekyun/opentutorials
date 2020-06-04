var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function (request, response) {
    db.query("select * from author", function (err, authors) {
        if (err) {
            console.log(err);
        }
        var title = 'Create Author';
        var authorList = template.authorList(authors);
        var html = template.HTML(title, 
            `<h2>AuthorList</h2>
             ${authorList}
             <style>
                table{
                    border-collapse:collapse;
                }
                td,th{
                    border: 1px solid black;
                }
             </style>
             `,
            `<h2>${title}</h2>
             <form action="/author/create_process" method="post">
                <p>
                <h3>ID</h3>
                <input type="text" name="id">
                </p>
                <p>
                <h3>Profile</h3>
                <input type="text" name="profile">
                </p>
                <input type="submit" value="create">
             </form>
            `,
            '','','');
        response.writeHead(200);
        response.end(html);
    });
}

exports.create_process = function(request, response){
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      console.log(post);
      var id = post.id;
      var profile = post.profile;
      
      db.query(`insert into author(name, profile) 
      values(?,?)`,[id, profile],function(err,results){
        if(err) throw err;
        response.writeHead(302, { Location: `/author` });
        response.end('sucess');
      });
    });
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    db.query("select * from author", function (err, authors) {
        if (err) throw err;
        db.query("select * from author where id=?",[queryData.id],function(err2,author){
            if(err2) throw err2;    
            var title = 'Update Author';
            var authorList = template.authorList(authors);
            var html = template.HTML(title, 
                `<h2>AuthorList</h2>
                ${authorList}
                <style>
                    table{
                        border-collapse:collapse;
                    }
                    td,th{
                        border: 1px solid black;
                    }
                </style>
                `,
                `<h2>${title}</h2>
                <form action="/author/update_process" method="post">
                    <input type="hidden" name="id" value="${author[0].id}">
                    <p>
                    <h3>Name</h3>
                    <input type="text" name="name" value="${author[0].name}">
                    </p>
                    <p>
                    <h3>Profile</h3>
                    <input type="text" name="profile" value="${author[0].profile}">
                    </p>
                    <input type="submit" value="update">
                </form>
                `,
                '','','');
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.update_process = function(request, response){
    var body = '';
    request.on('data',function(data){
        body += data;
    });
    request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        db.query('update author set name=?, profile=? where id=?',
            [name,profile,id],function(err,results){
            
            response.writeHead(302, {Location:'/author'});
            response.end('success');
        });
    });
}

exports.delete = function(request, response){
    var body='';
    request.on('data', function(data){
        body+=data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        db.query('delete from author where id=?',[id],function(err,results){
            response.writeHead(302, {Location:'/author'});
            response.end('success');
        });
    });
}