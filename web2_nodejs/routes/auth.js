var express = require('express');
var router = express.Router();
var template = require('../lib/template');

router.get('/login', function (req, res) {
    var title = 'WEB - Login';
    var html = template.HTML(title, '', `
        <h2>${title}</h2>
        <form action="/auth/login" method="POST">
            <p>
                <input type="text" name="email" placeholder="email">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit" value="Login">
            </p>
        </form>
      `, '','');
    res.send(html);
});

router.post('/login',function(req,res){
    var post = req.body;
    var email = post.email;
    var password = post.password;

    if(email === 'jeon@gmail.com' && password === '1234'){
        req.session.is_logined = true;
        req.session.nickname = 'jeon';
        req.session.save(function(){
            res.redirect('/');
        });
    }else{
        res.send('Who?!?');
    }
});

router.get('/logout', function(req,res){
    req.session.destroy(function(err){
        res.redirect('/');
    })
});

module.exports = router;