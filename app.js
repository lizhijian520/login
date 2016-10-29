var express = require('express');
var path = require('path');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
app.set('view engine', 'html');
//指定模板存放目录，当res.resolve的第一个参数写的是此路径下面的子路径
app.set('views', path.resolve('views'));
//用EJS的语法渲染html的模板文件
app.engine('html', require('ejs').__express);
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true,//每次客户端请求的时候重新保存session
    saveUninitialized: true,//保存未初始化的session
    secret: 'zfpx'//加密cookie
}));
function checkLogin(req, res, next) {
    //如果session对象存在，并且已经登录过了
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
}

//登录页
app.get('/login', function (req, res) {
    res.render('login')
});
app.post('/login', function (req, res) {
    var user = req.body;//得到请求体
    if (user.username == user.password) {//如果在表单中输入的用户名和密码相同，则登录成功
        //把用户名写入session
        req.session.username = user.username;
        //重定向到user页面
        res.redirect('/user');
    }
});
//用户主页
app.get('/user', checkLogin, function (req, res) {
    res.render('user', {username: req.session.username})
});
app.listen(8080);