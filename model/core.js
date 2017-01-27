/*
 * This contains all of the game logic shared by the client and server.
*/
'use strict';
let Utility = require('./utility.js'),
    Segment = require('./segment.js'),
    Player = require('./player.js'),
    Fruit = require('./fruit.js');

/* GameCore class */
var GameCore = function(width, height) {
    // game core to be run on clients and server
    this.players = {};
    if(!Number.isInteger(width) || width <= 0) {
        throw new Error('Width must be positive integer');
    }
    if(!Number.isInteger(height) || height <= 0) {
        throw new Error('Height must be positive integer');
    }
    this.width = width;
    this.height = height;
    // Fruit spawning
    this.fruits = {};
    this.fruitMax = 5; // TODO: 5 is arbitrary
    this.fruitSpawnInterval = 2000; // milliseconds
};

GameCore.prototype.playerCreate = function(id) {
    if (typeof id !== "string" || id.length === 0) {
        throw new Error('Parameter \'id\' required of type string');
    }
    return new Player(id, Math.trunc(Math.random() * this.width), Math.trunc(Math.random() * this.height));
};

GameCore.prototype.playerAdd = function(player) {
    if (!(player instanceof Player)) {
        throw new Error('Parameter \'player\' required of type Player');
    } else if (this.players[player.id]) {
        throw new Error('Duplicate player id cannot be added');
    }

    this.players[player.id] = player;
};

GameCore.prototype.playerDelete = function(id) {
    if (typeof id !== "string" || id.length === 0) {
        throw new Error('Parameter \'id\' required of type string');
    } else if (!this.players[id]) {
        throw new Error('Player does not exist to delete');
    }

    delete this.players[id];
};

GameCore.prototype.playerUpdateEntity = function(player) {
    if (!(player instanceof Player)) {
        throw new Error('Parameter \'player\' required of type Player');
    } else if (!this.players[player.id]) {
        throw new Error('Player does not exist to update');
    }
    this.players[player.id] = player;
};

GameCore.prototype.playerUpdate = function(id, delta) {
    // TODO: pass in game area (640 x 640)
    let p = this.players[id];
    for (let i = 0, length = p.segments.length; i < length; i++) {
        let s = p.segments[i];
        let v = Utility.directionVelocity[s.direction];
        let x = s.x + v[0] * delta / 1000,
            y = s.y + v[1] * delta / 1000;

        if (y > this.height) {
            y = this.height - (y - this.height);
            s.direction = Utility.directionReverse[s.direction];
        } else if (y < 0) {
            y = 0 - y;
            s.direction = Utility.directionReverse[s.direction];
        }

        if (x > this.width) {
            x = this.width - (x - this.width);
            s.direction = Utility.directionReverse[s.direction];
        } else if (x < 0) {
            x = 0 - x;
            s.direction = Utility.directionReverse[s.direction];
        }

        s.x = x;
        s.y = y;
        if (s.waypoints.length) {
            let w = s.waypoints[0];
            if (    (
                        Utility.directionsEW.indexOf(w.direction) > -1 &&
                        ((v[1] > 0 && s.y >= w.y) || (v[1] < 0 && s.y <= w.y))
                    ) || 
                    (
                        Utility.directionsNS.indexOf(w.direction) > -1 &&
                        ((v[0] > 0 && s.x >= w.x) || (v[0] < 0 && s.x <= w.x))
                    )
                ) {
                this.playerUpdateVelocity(id, i, w.direction);
                s.waypoints.shift();
            }
        }
    }
};

GameCore.prototype.playerUpdateVelocity = function(id, segment, turn) {
    let s = this.players[id].segments[segment];
    s.direction = turn;
    if (this.players[id].segments.length > segment + 1) {
        let sNext = this.players[id].segments[segment + 1];
        sNext.waypointAdd(s.x, s.y, turn);
    }
};

GameCore.prototype.playerUpdateAttributes = function(id, x, y, direction) {
    // player_id, move to x, move to y
    // move a player to a new x, y
    let p = this.players[id];
    p.segments[0].x = x;
    p.segments[0].y = y;
    if (direction !== undefined) {
        p.segments[0].direction = direction;
    }
};

GameCore.prototype.playersList = function() {
    let players = this.players;
    return Object.values ?
        Object.values(players) :
        Object.keys(players).map(function(key){ return players[key]; });
};

GameCore.prototype.fruitCreate = function(id) {
    // create a new Fruit object
    return new Fruit(id, Math.trunc(Math.random() * this.width), Math.trunc(Math.random() * this.height));
    //TODO: Location not occupied by other fruit or by the snake
};

GameCore.prototype.fruitAdd = function(fruit) {
    // add the Fruit to the list of in-play fruit
    this.fruits[fruit.id] = fruit;
};

GameCore.prototype.fruitDelete = function() {};

GameCore.prototype.fruitUpdateEntity = function(fruit) {
    this.fruits[fruit.id] = fruit;
};

GameCore.prototype.fruitList = function() {
    let fruits = this.fruits;
    return Object.values ?
        Object.values(fruits) :
        Object.keys(fruits).map(function(key){ return fruits[key]; });
};

module.exports = GameCore;