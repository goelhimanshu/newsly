
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var serverPort = 3000;
var app = express();

// all environments
app.set('port', process.env.PORT || serverPort);
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
app.use(express.urlencoded());
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Index page of application 
app.get('/', routes.index);

//API
app.get('/articlesList', routes.articles);
app.get('/article/:id', routes.article);
app.post('/article/:id', routes.addMarkdown);

app.get('/comments/:id', routes.comments);
app.post('/comments/:id', routes.addComment);

app.post('/notes/:id', routes.addNote);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
