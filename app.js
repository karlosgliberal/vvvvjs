
/**
 * Module dependencies.
 */
var express = require('express'),
    io = require('socket.io');

var app = module.exports = express.createServer();
//            conn.broadcast(JSON.stringify(message));
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/arbol', function(req, res){
  res.render('index', {
    locals: {
      title: 'Express'
    }
  });
});

app.get('/', function(req, res){
  res.redirect('/arbol');
});

// socket.io 
var socket = io.listen(app),
    buffer = []; 
socket.on('connection', function(client){ 
  // new client is here
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  client.on('message', function(message){
    client.broadcast(message);
  }) 
  client.on('disconnect', function(){ }) 
}); 

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3001);
  console.log("Express server listening on port %d", app.address().port)
}
