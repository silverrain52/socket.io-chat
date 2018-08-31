var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//모든 request는 client.html를 response
app.get('/',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

var count=1;
//사용자가 웹사이트에 접속하면 socket.io에 의해 'connection' event 자동발생
//'connection' event발생시 socket.id출력하고, socket.id에만 'change name'event 전달
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);

  //'send message'event listner는 event를 받은 후 모든 클라이언트에게 event 전달
  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });
});

http.listen(8080, function(){
  console.log('Web api is running on 8080!');
});
