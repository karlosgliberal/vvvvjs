
/**
 * Module dependencies.
 */
var express = require('express'),
    form = require('connect-form'),
    io = require('socket.io');

var app = module.exports = express.createServer(
    form({ keepExtensions: true, uploadDir: 'public/v4p'})  
  );
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

app.get('/form', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/form', function(req, res, next){
  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  req.form.complete(function(err, fields, files){
    if (err) {
      next(err);
    } else {
      console.log(files.image.name);
      console.log('\nuploaded %s to %s'
        ,  files.image.filename
        , files.image.path);
      res.redirect('back');
    }
  });
  // We can add listeners for several form
  // events such as "progress"
  req.form.on('progress', function(bytesReceived, bytesExpected){
    var percent = (bytesReceived / bytesExpected * 100) | 0;
    process.stdout.write('Uploading: %' + percent + '\r');
  });
});


app.get('/vvvvjs', function(req, res){
  res.render('index', {
    locals: {
      title: 'Ejemplo vvvv.js'
    }
  });
});

app.get('/', function(req, res){
  res.redirect('/vvvvjs');
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
  app.listen(3002);
  console.log("Express server listening on port %d", app.address().port)
}
