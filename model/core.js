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
    // Changes the direction of a given segment
    if (typeof id !== "string" || id.length === 0) {
        throw new Error('Parameter \'id\' required of type string');
    }
    if (typeof segment !== "number") {
        throw new Error('Parameter \'segment\' required of type number');
    }
    if (typeof turn !== "number") {
        throw new Error('Parameter \'turn\' required of type number');
    }
    let s = this.players[id].segments[segment];
    if (s.direction == turn || s.direction == Utility.directionReverse[turn]) {
        throw new Error('Provided direction must be perpendicular to current direction');
    }
    s.direction = turn;
    if (this.players[id].segments.length > segment + 1) {
        let sNext = this.players[id].segments[segment + 1];
        sNext.waypointAdd(s.x, s.y, turn);
    }
};

GameCore.prototype.playerUpdateAttributes = function(id, x, y, direction) {
    if (typeof id !== "string" || id.length === 0) {
        throw new Error('Parameter \'id\' required of type string');
    } else if (!this.players[id]) {
        throw new Error('Player does not exist to update attributes of');
    } else if(this.players[id].segments.length === 0) {
        throw new Error('Player requires atleast one segment');
    }
    if (direction !== undefined && typeof direction !== "number") {
        throw new Error('Parameter \'direction\' required of type number');
    }
    if (typeof x !== "number") {
        throw new Error('Parameter \'x\' required of type number');
    }
    if (typeof y !== "number") {
        throw new Error('Parameter \'y\' required of type number');
    }
    if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
        let p = this.players[id];
        p.segments[0].x = x;
        p.segments[0].y = y;
        if (direction !== undefined) {
            p.segments[0].direction = direction;
        }
    }
};

GameCore.prototype.playersList = function() {
    for (let p in this.players) {
        if (!(this.players[p] instanceof Player)) {
            throw new Error('Items required of type Player');
        }
    }
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
    if (!(fruit instanceof Fruit)) {
        throw new Error('Parameter \'fruit\' required of type Fruit');
    } else if (this.fruits[fruit.id]) {
        throw new Error('Duplicate fruit id cannot be added');
    }
    this.fruits[fruit.id] = fruit;
};

GameCore.prototype.fruitDelete = function(id) {
    // delete the Fruit object
    if (typeof id !== "string" || id.length === 0) {
        throw new Error('Parameter \'id\' required of type string');
    } else if (!this.fruits[id]) {
        throw new Error('Fruit does not exist to delete');
    }

    delete this.fruits[id];
};

GameCore.prototype.fruitUpdateEntity = function(fruit) {
    if (!(fruit instanceof Fruit)) {
        throw new Error('Parameter \'fruit\' required of type Fruit');
    } else if (!this.fruits[fruit.id]) {
        throw new Error('Fruit does not exist to update');
    }
    this.fruits[fruit.id] = fruit;
};

GameCore.prototype.fruitList = function() {
    // returns an array of Fruit objects
    for (let f in this.fruits) {
        if (!(this.fruits[f] instanceof Fruit)) {
            throw new Error('Items required of type Fruit');
        }
    }
    let fruits = this.fruits;
    return Object.values ?
        Object.values(fruits) :
        Object.keys(fruits).map(function(key){ return fruits[key]; });
};

module.exports = GameCore;