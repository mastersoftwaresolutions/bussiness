
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var qs = require('querystring');
var mysql = require('mysql');

// database dependencies
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var app = express();

// all environments
app.set('port', process.env.PORT || 3002);
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
var connection = require('./db.js').localConnect();
connection.connect();
//default route
app.get('/', routes.search);
// to save new project
app.post('/newproject', routes.newproject(db));
// to view new project ui
app.get('/addproject', routes.addproject);
// autocomple for developer
app.get('/autocomplete', routes.autocomplete(db));
// autocomplete for keyword with adding new keyword
app.get('/keyautocomplete', routes.keyautocomplete(db));
// autocomplete for srach without adding enw keyword
app.get('/searchautocomplete', routes.searchautocomplete(db));
// to view sarch page ui
app.get('/search', routes.search);
// to redirect on projectlist page
app.post('/searchproject', routes.searchproject(db));
//to view projectlist page  ui
app.get('/projectlist', routes.projectlist(db));
// to delete project 
app.post('/deleteproject', routes.deleteproject(db));
// to edit project ui
app.get('/editproject', routes.editproject);
// to edit project
app.get('/edit', routes.edit(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
