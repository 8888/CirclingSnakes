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

    socket.on('disconnect', function() {
        game_server.playerDelete(socket.id);
        socket.broadcast.emit('playerDelete', {playerId: socket.id});
        console.log(">Player Delete", socket.id);
    });

    socket.on('playerAdd', function(id) {
        playerAdd(socket, id);
    });

    socket.on('playerTurn', function(playerId, direction) {
        game_server.playerUpdateVelocity(playerId, 0, direction);
        socket.broadcast.emit('playerTurn', {
            playerId: playerId,
            direction: direction
        });
        console.log(">Player turn and update", playerId);
    });
});

let playerAdd = function(socket, id, announce) {
    let player = game_server.playerCreate(id);
    player.segmentAdd();
    game_server.playerAdd(player);
    player.timeUpdated = process.hrtime();
    if (announce) {
        socket.emit('gameJoin', {
            playerId: player.id,
            players: game_server.playersList()
        });
    }
    socket.broadcast.emit('playerAdd', { player: player });
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
}, 20);
setInterval(function() {
    io.emit('playersUpdate', { 
        players: game_server.playersList()
    });
}, 1000);