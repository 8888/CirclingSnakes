'use strict';
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = 3000;

/* express server */
app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/view/index.html');
});

http.listen(port, function(){
    console.log('listening on port "' + port + '"');
});

/* socket.io server */
//var Player = require('./player.js');
var game_core = require('./core.js');
let game_server = new game_core(640, 640);
// TODO: for multiple games, have a dictionary instead
// of a single instance.

io.on('connection', function(socket) {
    // all communication starts here

    /* Normally everything should be wrapped in a 
     * 'socket.on(' but for our special case, we 
     * do want everyone to join right away without
     * an explicit call to game_join or whatnot.
     */
    /* GAME JOIN BEGIN */
    playerAdd(socket, socket.id, true);
    /* GAME JOIN END */

    socket.on('playerAdd', function(id) {
        playerAdd(socket, id);
    });

    socket.on('disconnect', function() {
        game_server.playerDelete(socket.id);
        socket.broadcast.emit('player_delete', {playerId: socket.id});
        console.log(">Player Delete", socket.id);
    });

    socket.on('player_moved', function(playerId, x, y, x_velocity, y_velocity) {
        // a client tells the server they moved their player
        game_server.playerUpdateAttributes(playerId, x, y, x_velocity, y_velocity);
        game_server.players[playerId].timeUpdated = process.hrtime();
        socket.broadcast.emit('player_update_attributes', {
            playerId: playerId,
            x: x,
            y: y, 
            x_velocity: x_velocity,
            y_velocity: y_velocity
        });
    });
});

let playerAdd = function(socket, id, announce) {
    let player = game_server.playerCreate(id);
    game_server.playerAdd(player);
    player.timeUpdated = process.hrtime();
    if (announce) {
        socket.emit('game_join', {
            player: player,
            players: game_server.players
        });
    }
    socket.broadcast.emit('player_add', { player: player });
    console.log(">Player Create", id);
}

let gameUpdateTime = process.hrtime();
setInterval(function(){
    gameUpdateTime = process.hrtime(gameUpdateTime);
    let gameDelta = Math.round((gameUpdateTime[0]*1000) + (gameUpdateTime[1]/1000000));
    gameUpdateTime = process.hrtime();
    //console.log(gameDelta);

    for (let playerId in game_server.players) {
        let p = game_server.players[playerId];
        if (p.timeUpdated){
            let updateTime = process.hrtime(p.timeUpdated);
            let addDelta = Math.round((updateTime[0]*1000) + (updateTime[1]/1000000));
            game_server.playerUpdate(playerId, addDelta);
        } else {
            game_server.playerUpdate(playerId, gameDelta);
        }
        p.timeUpdated = process.hrtime();
    }
    io.emit('update_player_list', { players: game_server.players });
}, 20);