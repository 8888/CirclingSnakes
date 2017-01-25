/*
 * This contains all of the game logic shared by the client and server.
*/
'use strict';
let Utility = require('./utility.js'),
    Segment = require('./segment.js'),
    Player = require('./player.js');

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
};

GameCore.prototype.playerCreate = function(id) {
    return new Player(id, Math.trunc(Math.random() * this.width), Math.trunc(Math.random() * this.height));
};

GameCore.prototype.playerAdd = function(player) {
    this.players[player.id] = player;
};

GameCore.prototype.playerDelete = function(id) {
    delete this.players[id];
};

GameCore.prototype.playerUpdateEntity = function(player) {
    this.players[player.id] = player;
};

GameCore.prototype.playerUpdate = function(id, delta) {
    // TODO: pass in game area (640 x 640)
    let p = this.players[id];
    for (let i = 0, length = p.segments.length; i < length; i++) {
        let s = p.segments[i];
        let x = s.x + s.x_velocity * delta / 1000,
            y = s.y + s.y_velocity * delta / 1000;

        if (y > this.height) {
            y = this.height - (y - this.height);
            s.y_velocity *= -1;
        } else if (y < 0) {
            y = 0 - y;
            s.y_velocity *= -1;
        }

        if (x > this.width) {
            x = this.width - (x - this.width);
            s.x_velocity *= -1;
        } else if (x < 0) {
            x = 0 - x;
            s.x_velocity *= -1;
        }

        s.x = x;
        s.y = y;
        if (s.waypoints.length) {
            let w = s.waypoints[0];
            if (    (
                        (w.direction == Utility.DIRECTION_WEST || w.direction == Utility.DIRECTION_EAST) &&
                        ((s.y_velocity > 0 && s.y >= w.y) || (s.y_velocity < 0 && s.y <= w.y))
                    ) || 
                    (
                        (w.direction == Utility.DIRECTION_NORTH || w.direction == Utility.DIRECTION_SOUTH) &&
                        ((s.x_velocity > 0 && s.x >= w.x) || (s.x_velocity < 0 && s.x <= w.x))
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
    if (turn == Utility.DIRECTION_WEST) {
        s.x_velocity = -25;
        s.y_velocity = 0;
    } else if (turn == Utility.DIRECTION_NORTH) {
        s.x_velocity = 0;
        s.y_velocity = -25;
    } else if (turn == Utility.DIRECTION_EAST) {
        s.x_velocity = 25;
        s.y_velocity = 0;
    } else if (turn == Utility.DIRECTION_SOUTH) {
        s.x_velocity = 0;
        s.y_velocity = 25;
    }
    if (this.players[id].segments.length > segment + 1) {
        let sNext = this.players[id].segments[segment + 1];
        sNext.waypointAdd(s.x, s.y, turn);
    }
};

GameCore.prototype.playerUpdateAttributes = function(id, x, y, x_velocity, y_velocity) {
    // player_id, move to x, move to y
    // move a player to a new x, y
    let p = this.players[id];
    p.segments[0].x = x;
    p.segments[0].y = y;
    if (x_velocity !== undefined) {
        p.segments[0].x_velocity = x_velocity;
    }
    if (y_velocity !== undefined) {
        p.segments[0].y_velocity = y_velocity;
    }
};

GameCore.prototype.playersList = function() {
    let players = this.players;
    return Object["values"] ?
        Object.values(players) :
        Object.keys(players).map(function(key){ return players[key]; });
};

module.exports = GameCore;