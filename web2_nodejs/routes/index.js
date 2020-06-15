var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');

//route, routing
//app.get('/',(req,res) => res.send('Hello Wolrd!!'));
router.get('/', function (req, res) {
    var title = 'Welcome!!';
    var description = 'Welcome to Node.js`s World';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
            <h2>${title}</h2>
            ${description}
            <img src="/images/hello.jpg" 
            style="width:300px; display:block; padding-top:5px;">
            `,
            `<a href="/topic/create">create</a>`,
            auth.statusUI(req,res));
    res.send(html);
});

module.exports = router;