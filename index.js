'use strict';
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    uuid = require('uuid'); // unique user id

/* express server */
app.use('/', express.static(__dirname + '/')); // allows inlcude of files ex: in <script>

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html'); // send index.html to clients
});

http.listen(3000, function(){
    console.log('listening on *:3000'); // listen on port 3000
});

/* socket.io server */
var game_server = require('./game_server.js'); // GameCore object

io.on('connection', function(client) {
    // new client connects to server
    client.userid = uuid(); // generate an id
    let new_player = game_server.server_add_player(client.userid); // server creates a new Player object
    client.emit('user_connected', client.userid); // provide the client w/ its id
    io.emit('update_player_list', game_server.players); // sends the updated player list to all clients

    client.on('disconnect', function() {
        // client disconnects
        console.log("user disconnected: " + client.userid);
        // TODO: Remove from the array of players/sockets
    });

    client.on('player_moved', function(client_id, x, y) {
        // a client tells the server they moved their player
        game_server.move_player(client_id, x, y);
        io.emit('update_player_list', game_server.players); // TODO: This is incorrect and temporary. This needs to be done through periodic updates through the server's loop
    });
});