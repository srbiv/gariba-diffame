var app = require('express').createServer();
app.register('.html', require('jade'));
app.set('view engine', 'jade');
app.get('/', function(req, res){
    res.render('index.html');
});
app.listen(80);
