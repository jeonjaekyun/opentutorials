var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function (request, response) {
    db.query("select * from topic", function (err, topics) {
        if (err) {
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
}

exports.page = function (request, response) {
    //url.parse는 url에 데이터를 배열 형태로 파싱해준다
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select * from topic`, function (err, topics) {
        if (err) throw err;
        //보안을 위해 ?를 사용한다.
        db.query(
            `select t.id, title, description, created, author_id, name
           from topic as t left join author as a
           on t.author_id = a.id
           where t.id=?`, [queryData.id], function (err2, topic) {

            if (err2) throw err2;
            title = topic[0].title;
            description = topic[0].description;
            author = topic[0].name;
            id = topic[0].id;

            list = template.list(topics);
            html = template.HTML(title, list,
                `<h2>${title}</h2>${description}<br>
           <h3>author : ${author}</h3>`,
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

exports.create = function(request, response){
    db.query(`select * from author`,function(err, authors){
        console.log(authors);
        title = 'WEB - Create';
        var selectAuthor = template.authorList(authors);

        var html = template.HTML(title, '', `
          <h2>${title}</h2>
          <form action="/create_process" method="POST">
              <h3>TITLE</h3>
              <p><input type="text" name="title" placeholder="title"></p>
              <h3>Description</h3>
              <p>
                  <textarea name="description" 
                  placeholder="description" cols="100" rows="20"></textarea>
              </p>
              ${selectAuthor}
              <p>
                  <input type="submit" value="등록">
              </p>
          </form>
        `,'');
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
      var author = post.author;
      title = post.title;
      description = post.description;
      
      db.query(`insert into topic(title, description, created, author_id) 
      values(?,?,now(),?)`,[title, description,author],function(err,results){
        if(err) throw err;
        response.writeHead(302, { Location: `/?id=${results.insertId}` });
        response.end('sucess');
      });
    });
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('select * from topic where id=?',[queryData.id],function(err, topic){
        if(err) throw err;
        db.query(`select * from author`,function(err2,authors){
  
          console.log(topic);
          selectAuthor = template.authorList(authors,topic[0].author_id);
          console.log(topic[0].author_id);
          html = template.HTML(topic[0].title, '', `
            <h2>${topic[0].title}</h2>
            <form action="/update_process" method="POST">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" value="${topic[0].title}"></p>
                <p>
                    <textarea name="description" cols="100" rows="20">${topic[0].description}</textarea>
                </p>
                ${selectAuthor}
                <p>
                    <input type="submit" value="수정">
                </p>
            </form>
          `,'');
          response.writeHead(200);
          response.end(html);
        });
      });
}

exports.update_process = function(request, response){
    var body = "";
    request.on('data', function(data){
      body += data;
    });
    request.on('end',function(){
      console.log(body);
      //body는 QureyString 형태이다 ex)id=Reactjs&title=Reactjs
      var post = qs.parse(body);
      var id  = post.id;
      author = post.author;
      title = post.title;
      description = post.description;
      console.log(post);
      db.query('update topic set title=?, description=?, author_id=? where id=?',
        [title,description, author, id],function(err,results){

          if(err) throw err;

          response.writeHead(302, { Location: `/?id=${id}` });
          response.end('sucess');
      });
    });
}

exports.delete = function(request, response){
    var body = "";
    request.on('data', function(data){
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var id  = post.id;
      db.query('delete from topic where id = ?',[id],function(err){
        if(err) throw err;
        response.writeHead(302,{Location:`/`});
        response.end('success');
      });
    });
}