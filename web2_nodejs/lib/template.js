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
        <h1><a href="/">WEB</a></h1>
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
        list = list + `<li><a href="/page/${file}">${file}</a></li>`
      });
      list = list + '</ul>';
      return list;
    }
  };

  module.exports = template;