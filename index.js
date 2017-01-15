'use strict';
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    uuid = require('uuid'); // unique user id

/* express server */
app.use('/', express.static(__dirname + '/')); // allows inlcude of files ex: in <script>

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

/* socket.io server */
var game_server = require('./game_server.js');

io.on('connection', function(client) {
    // calls when a client makes a new connection to io server
    client.userid = uuid(); // generate an id
    client.emit('user_connected', client.userid);
    console.log("user connected: " + client.userid);

    // sends the updated player list to all clients
    game_server.players.push(client.userid);
    io.emit('update_player_list', game_server.players);

    //calls when a client disconnects
    client.on('disconnect', function() {
        // call when a client disconnects
        console.log("user disconnected: " + client.userid);
    });

    // receive client feedback, to be used for receiving data or inputs etc
    client.on('received_players', function(id) {
        console.log("Client " + id + " received the player list");
    });
});