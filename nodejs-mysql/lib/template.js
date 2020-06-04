var template ={
    HTML:function(title, list, body, control, author) {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">HOME</a></h1>
          ${author}
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
    },authorName:function(authors, author_id){
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
    },authorList:function(authors){
      var tag = `
        <table>
        <tr>
            <th>name</th><th>profile</th><th>update</th><th>delete</th>
        </tr>`;
        authors.forEach(author => {
            tag += `<tr>
                    <td>${author.name}</td>
                    <td>${author.profile}</td>
                    <td><a href="/author/update?id=${author.id}">update</a></td>
                    <td>
                    <form action="/author/delete" method="post">
                      <input type="hidden" name="id" value="${author.id}">
                      <input type="submit" value="delete">
                    </form>
                    </td>
                    </tr>`
        });
        tag += '</table>';
        return tag;
    }
  };

  module.exports = template;