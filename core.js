/*
 * This contains all of the game logic shared by the client and server.
*/
'use strict';
var Player = require('./player.js');

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
    this.left = 0b1;
    this.up = 0b10;
    this.right = 0b100;
    this.down = 0b1000; 
};

GameCore.prototype.playerCreate = function(id) {
    return new Player(id, Math.trunc(Math.random() * this.width), Math.trunc(Math.random() * this.height));
};

GameCore.prototype.playerAdd = function(player) {
    console.log("core.playerAdd", player.id);
    this.players[player.id] = player;
};

GameCore.prototype.playerDelete = function(id) {
    console.log("core.playerDelete", id);
    delete this.players[id];
};

GameCore.prototype.playerUpdate = function(id, delta) {
    // TODO: pass in game area (640 x 640)
    let p = this.players[id];
    for (let segment = 0; segment < p.segments.length; segment++) {
        let x = p.segments[segment].x + p.segments[segment].x_velocity * delta / 1000,
            y = p.segments[segment].y + p.segments[segment].y_velocity * delta / 1000;

        if (y > this.height) {
            y = this.height - (y - this.height);
            p.segments[segment].y_velocity *= -1;
        } else if (y < 0) {
            y = 0 - y;
            p.segments[segment].y_velocity *= -1;
        }

        if (x > this.width) {
            x = this.width - (x - this.width);
            p.segments[segment].x_velocity *= -1;
        } else if (x < 0) {
            x = 0 - x;
            p.segments[segment].x_velocity *= -1;
        }

        p.segments[segment].x = x;
        p.segments[segment].y = y;

        if (p.segments[segment].velocity_change_direction) { // if there is a turn to be made
            if (p.segments[segment].velocity_change_direction == this.left) { // turning left
                if (p.segments[segment].y_velocity > 0 && p.segments[segment].y >= p.segments[segment].velocity_change_y) { // moving up
                    this.playerUpdateVelocity(id, segment, p.velocity_change_direction);
                    p.segments[segment].velocity_change_direction = null;
                } else if (p.segments[segment].y_velocity < 0 && p.segments[segment].y <= p.segments[segment].velocity_change_y) { // moving down
                    this.playerUpdateVelocity(id, segment, p.velocity_change_direction);
                    p.segments[segment].velocity_change_direction = null;
                } else if (p.segments[segment].x_velocity > 0 && p.segments[segment].X >= p.segments[segment].velocity_change_x) { // moving right
                    this.playerUpdateVelocity(id, segment, p.velocity_change_direction);
                    p.segments[segment].velocity_change_direction = null;
                }
            }           
        }
    }
};

GameCore.prototype.playerUpdateVelocity = function(id, segment, turn) {
    let p = this.players[id];
    if (turn == this.left) {
        p.segments[segment].x_velocity = -25;
        p.segments[segment].y_velocity = 0;
    } else if (turn == this.up) {
        p.segments[segment].x_velocity = 0;
        p.segments[segment].y_velocity = -25;
    } else if (turn == this.right) {
        p.segments[segment].x_velocity = 25;
        p.segments[segment].y_velocity = 0;
    } else if (turn == this.down) {
        p.segments[segment].x_velocity = 0;
        p.segments[segment].y_velocity = 25;
    }
    if (p.segments.length > segment + 1) { // length is greater than index
        p.segments[segment + 1].velocity_change_x = p.segments[segment].x;
        p.segments[segment + 1].velocity_change_y = p.segments[segment].y;
        p.segments[segment + 1].velocity_change_direction = turn;
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

if (typeof global != "undefined") {
    module.exports = GameCore;
}