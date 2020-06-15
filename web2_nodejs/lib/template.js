var template ={
    HTML:function(title, list, body, control,authStatusUI='<a href="/auth/login">Login</a>') {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${authStatusUI}
        <h1><a href="/">HOME</a></h1>
          ${list}
          ${control}
          ${body}
        </p>
      </body>
      </html>    
      `;
    },list:function(fileList) {
      var list = '<ul>';
      fileList.forEach(function (file) {
        //list = list + `<li><a href="/?id=${file}">${file}</a></li>`
        list = list + `<li><a href="/topic/${file}">${file}</a></li>`
      });
      list = list + '</ul>';
      return list;
    }
  };

  module.exports = template;