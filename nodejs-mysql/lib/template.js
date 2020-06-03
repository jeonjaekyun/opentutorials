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
    }
  };

  module.exports = template;