
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var qs = require('querystring');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/userlist', routes.userlist(db));
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db));
app.post('/newproject', routes.newproject(db));

app.get('/login', routes.login);
app.post('/checklogin', routes.checklogin(db));
app.get('/addproject', routes.addproject);
app.get('/autocomplete', routes.autocomplete(db));
app.get('/keyautocomplete', routes.keyautocomplete(db));
app.get('/search', routes.search);
app.post('/searchproject', routes.searchproject(db));
app.get('/projectlist', routes.projectlist(db));
app.post('/newkeyword', routes.newkeyword(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
