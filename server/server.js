var app =   require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 3000

app.use('./app/game.js')(io);

app.get('/', function(req, res){
    res.send("");
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
