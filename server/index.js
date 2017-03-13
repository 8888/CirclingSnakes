'use strict';
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    port = 3000;

/* express server */
app.use('/', express.static(path.join(__dirname, '../')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
});

http.listen(port, function(){ console.log('listening on port "' + port + '"'); });

/* socket.io server */
var game_core = require('../model/core.js');
let game_server = new game_core(640, 640);
io.on('connection', function(socket) {
    /* Normally everything should be wrapped in a 'socket.on(' but 
     * for our special case, we do want everyone to join right away
     * withoutan explicit call to game_join or whatnot. */
    playerAdd(socket, socket.id, true);

    socket.on('disconnect', function() {
        game_server.playerDelete(socket.id);
        socket.broadcast.emit('playerDelete', {playerId: socket.id});
        console.log(">Player Delete", socket.id);
    });
    socket.on('playerAdd', function(id) {
        playerAdd(socket, id);
    });
    socket.on('playerTurn', function(playerId, direction) {
        if (game_server.players[playerId].distanceUntilTurn <= 0) {
            game_server.playerUpdateVelocity(playerId, 0, direction);
            socket.broadcast.emit('playerTurn', {
                playerId: playerId,
                direction: direction
            });
        }
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
            players: game_server.playersList(),
            fruits: game_server.fruitList()
        });
    }
    socket.broadcast.emit('playerAdd', { player: player });
    console.log(">Player Create", id);
};

let fruitAdd = function(id) {
    let fruit = game_server.fruitCreate(id);
    game_server.fruitAdd(fruit);
    io.emit('fruitAdd', { fruit: fruit });
};

let checkCollisions = function(player) {
    // Fruit collision
    if (game_server.fruits) {
        let fruit = game_server.checkFruitCollision(player);
        if (fruit) {
            for (let f = 0; f < fruit.length; f++) {
                game_server.fruitDelete(fruit[f]);
                io.emit('fruitDelete', {fruitId: fruit[f]});
                player.segmentAdd();
                io.emit('playersUpdate', {players: game_server.playersList()});
            }
        }
    }
    // Wall collision
    if (game_server.checkWallCollision(player)) {   
        player.kill();
        io.emit('playerKilled', {playerId: player.id});
    }
    // Collision with other snakes
    let collidedSnakes = game_server.checkSnakeCollision(player);
    if (collidedSnakes) {
        for (let p = 0; p < collidedSnakes.length; p++) {
            collidedSnakes[p].kill();
            io.emit('playerKilled', {playerId: collidedSnakes[p].id});
        }
    }
};

let gameUpdateTime = process.hrtime();
setInterval(function(){
    gameUpdateTime = process.hrtime(gameUpdateTime);
    let gameDelta = Math.round((gameUpdateTime[0]*1000) + (gameUpdateTime[1]/1000000));
    gameUpdateTime = process.hrtime();

    for (let playerId in game_server.players) {
        let p = game_server.players[playerId];
        if (p.isAlive) {
            if (p.timeUpdated){
                let updateTime = process.hrtime(p.timeUpdated);
                let addDelta = Math.round((updateTime[0]*1000) + (updateTime[1]/1000000));
                game_server.playerUpdate(playerId, addDelta);
            } else {
                game_server.playerUpdate(playerId, gameDelta);
            }
            checkCollisions(p);
            p.timeUpdated = process.hrtime();
        }
    }
}, 20);

setInterval(function() {
    io.emit('playersUpdate', { 
        players: game_server.playersList()
    });
    io.emit('fruitUpdate', { 
        fruits: game_server.fruitList()
    });
}, 1000);

setInterval(function() {
    // Generate fruit on set interval if the max has not been reached
    if (Object.keys(game_server.fruits).length < game_server.fruitMax) {
        let id = Math.trunc(Math.random() * 10000).toString();
        fruitAdd(id);
    }
}, game_server.fruitSpawnInterval);