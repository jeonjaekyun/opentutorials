var template ={
    HTML:function(title, list, body, control) {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">HOME</a></h1>
          ${list}
          ${control}
          ${body}
        </p>
      </body>
      </html>    
      `;
    },list:function(topics) {
      var list = '<ul>';
      topics.forEach(function (topic) {
        list = list + `<li><a href="/?id=${topic.id}">${topic.title}</a></li>`
      });
      list = list + '</ul>';
      return list;
    },authorList:function(authors, author_id){
      var tag = '';
        authors.forEach(author=> {
          var selected = '';
          if(author_id === author.id){
            selected = ' selected';
          }
          tag += `<option value=${author.id} ${selected}>${author.name}</option>`;
        });
      return `
        <p>
        <h3>Author</h3>
        <select name="author">
          ${tag}
        </select>
        </p>
      `;
    }
  };

  module.exports = template;