var app     = require('express')();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
const port = 3000;

app.get('/', function(req, res){
    res.send("");
});

require("./app/game.js")(io);

http.listen(port, function(){
    console.log('listening on *:' + port);
});
