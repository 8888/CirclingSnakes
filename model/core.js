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
    this.fruitRadius = 10;
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
    if (typeof delta !== "number" || delta <= 0) {
        throw new Error('Parameter \'delta\' required to be positive');
    }
    let p = this.players[id];
    for (let i = 0, length = p.segments.length; i < length; i++) {
        let s = p.segments[i];
        let v = Utility.directionVelocity[s.direction];
        let x = s.x + (v[0] * p.velocity) * delta / 1000,
            y = s.y + (v[1] * p.velocity) * delta / 1000;
        s.x = x;
        s.y = y;
        if ( i == 0 && p.distanceUntilTurn > 0) {
            p.distanceUntilTurn -= Math.abs(((v[0] * p.velocity) * delta / 1000) + ((v[1] * p.velocity) * delta / 1000));
        }
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
                // Account for passing the waypoint
                let dx = Math.abs(s.x - w.x),
                    dy = Math.abs(s.y - w.y);
                if (Utility.directionVelocity[s.direction][0] + Utility.directionVelocity[s.direction][1] + Utility.directionVelocity[w.direction][0] + Utility.directionVelocity[w.direction][1] == 0) {
                    // E/N and W/S and S/W and N/E
                    s.x += dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                    s.y += dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                } else if (Utility.directionsEW.indexOf(s.direction) > -1) {
                    // E/S and W/N                
                    s.x -= dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                    s.y += dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                } else {
                    // S/E and N/W
                    s.x += dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                    s.y -= dy * Utility.directionVelocity[w.direction][0] + dx * Utility.directionVelocity[w.direction][1];
                }
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
    } else if (!this.players[id]) {
        throw new Error('Player does not exist to update velocity of');
    }
    if (typeof segment !== "number") {
        throw new Error('Parameter \'segment\' required of type number');
    } else if (!this.players[id].segments[segment]) {
        throw new Error('Segment does not exist to update velocity of');
    }
    if (typeof turn !== "number" || Utility.directions.indexOf(turn) == -1) {
        throw new Error('Parameter \'turn\' required of type number in Utility.directions');
    }
    let s = this.players[id].segments[segment];
    if (s.direction == turn || s.direction == Utility.directionReverse[turn]) { //TODO: This needs to be checked before calling this function
        throw new Error('Provided direction must be perpendicular to current direction');
    }
    s.direction = turn;
    if (this.players[id].segments.length > segment + 1) {
        let sNext = this.players[id].segments[segment + 1];
        sNext.waypointAdd(s.x, s.y, turn);
    }
    if (segment == 0) {
        this.players[id].distanceUntilTurn = s.size;
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
    if (direction !== undefined) {
        if (typeof direction !== "number" || Utility.directions.indexOf(direction) == -1) {
            throw new Error('Parameter \'direction\' required of type number in Utility.directions');
        }
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
    let searching = true,
        x = 0,
        y = 0;
    while (searching) {
        searching = false;
        x = Math.trunc(Math.random() * this.width);
        y = Math.trunc(Math.random() * this.height);
        for (let fruit in this.fruits) {
            if (Utility.checkRectangularCollision(
                {x: x - this.fruitRadius, y: y - this.fruitRadius, width: this.fruitRadius * 2, height: this.fruitRadius * 2},
                {x: fruit.x - fruit.radius, y: fruit.y - fruit.radius, width: fruit.radius * 2, height: fruit.radius * 2}
            )) {
                searching = true;
                break;
            }
        }
        for (let player in this.players) {
            for (let s = 0; s < this.players[player].segments.length; s++) {
                if (Utility.checkRectangularCollision(
                    {x: x - this.fruitRadius, y: y - this.fruitRadius, width: this.fruitRadius * 2, height: this.fruitRadius * 2},
                    {x: this.players[player].segments[s].x, y: this.players[player].segments[s].y, width: this.players[player].segments[s].size, height: this.players[player].segments[s].size}
                )) {
                    searching = true;
                    break;
                }
            }
            if (searching) {
                break;
            }
        }
    }
    return new Fruit(id, x, y, this.fruitRadius);
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

GameCore.prototype.checkFruitCollision = function(player) {
    let fruitToDelete = [];
    let x = player.segments[0].x,
        y = player.segments[0].y,
        size = player.segments[0].size;
    for (let f in this.fruits) {
        let fruit = this.fruits[f];
        if (Utility.checkRectangularCollision(
            {x: x, y: y, width: size, height: size},
            {x: fruit.x - fruit.radius, y: fruit.y - fruit.radius, width: fruit.radius * 2, height: fruit.radius * 2}
        )) {
            fruitToDelete.push(fruit.id);
        }
    }
    return fruitToDelete;
};

GameCore.prototype.checkWallCollision = function(player) {
    let segmentsToCheck = player.segments.length;
    if (player.wallsKill) {
        segmentsToCheck = 1;
    }
    for (let i = 0; i < segmentsToCheck; i++) {
        let s = player.segments[i];
        if (player.wallsKill) {
            if (s.y > this.height || s.y < 0 || s.x > this.width || s.x < 0) {
                return true;
            }
        } else {
            if (s.y > this.height) {
                s.y = this.height - (s.y - this.height);
                s.direction = Utility.directionReverse[s.direction];
            } else if (s.y < 0) {
                s.y = 0 - s.y;
                s.direction = Utility.directionReverse[s.direction];
            }

            if (s.x > this.width) {
                s.x = this.width - (s.x - this.width);
                s.direction = Utility.directionReverse[s.direction];
            } else if (s.x < 0) {
                s.x = 0 - s.x;
                s.direction = Utility.directionReverse[s.direction];
            }
        }
    }
};

GameCore.prototype.checkSnakeCollision = function(player) {
    // returns an array of player objects that should be killed
    let playersToKill = [];
    for (let p in this.players) {
        let enemy = this.players[p];
        if (enemy != player && player.enemyCollisionKills) {
            for (let s = 0; s < enemy.segments.length; s++) {
                if (Utility.checkRectangularCollision(
                    {x: player.segments[0].x, y: player.segments[0].y, width: player.segments[0].size, height: player.segments[0].size},
                    {x: enemy.segments[s].x, y: enemy.segments[s].y, width: enemy.segments[s].size, height: enemy.segments[s].size}
                )) {
                    playersToKill.push(player);
                    if (s === 0) { // head on collision
                        playersToKill.push(enemy);
                    }
                    break;
                }
            }
            if (!player.isAlive) {
                break;
            }
        } else if (enemy == player && player.selfCollisionKills) {
            for (let s = 2; s < player.segments.length; s++) {
                // s = 2 becuase no collision possible with 1st 2 segments
                if (Utility.checkRectangularCollision(
                    {x: player.segments[0].x, y: player.segments[0].y, width: player.segments[0].size, height: player.segments[0].size},
                    {x: enemy.segments[s].x, y: enemy.segments[s].y, width: enemy.segments[s].size, height: enemy.segments[s].size}
                )) {
                    playersToKill.push(player);
                }
            }
        }
    }
    return playersToKill;
};

module.exports = GameCore;