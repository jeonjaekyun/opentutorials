var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var helmet = require('helmet');
var express = require('express');
var app = express();

//middleware
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*',function(req,res,next){
    fs.readdir('./data','utf8',function(err,fileList){
        req.list = fileList;
        next();
    });
});

app.use(session({
    secret:'fdksjfk1@#@!%!osj32@',
    resave: false,
    saveUninitialized:true,
    store:new FileStore()
}));

app.use('',indexRouter);
app.use('/topic',topicRouter);
app.use('/auth', authRouter);

app.use(function(req,res,next){
    res.status(404).send('Sorry can`t find that!');
});

app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500).send('Someting broke!');
});

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
});