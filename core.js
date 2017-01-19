/*
 * This contains all of the game logic shared by the client and server.
*/
'use strict';

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
    let p = this.players[id],
        x = p.x + p.x_velocity * delta / 1000,
        y = p.y + p.y_velocity * delta / 1000;
    if (y > this.height) {
        y = this.height - (y - this.height);
        p.y_velocity *= -1;
    } else if (y < 0) {
        y = 0 - y;
        p.y_velocity *= -1;
    }

    if (x > this.width) {
        x = this.width - (x - this.width);
        p.x_velocity *= -1;
    } else if (x < 0) {
        x = 0 - x;
        p.x_velocity *= -1;
    }

    p.x = x;
    p.y = y;
};

GameCore.prototype.playerUpdateVelocity = function(id, turn) {
    let p = this.players[id];
    if (turn == this.left) {
        p.x_velocity = -25;
        p.y_velocity = 0;
    } else if (turn == this.up) {
        p.x_velocity = 0;
        p.y_velocity = -25;
    } else if (turn == this.right) {
        p.x_velocity = 25;
        p.y_velocity = 0;
    } else if (turn == this.down) {
        p.x_velocity = 0;
        p.y_velocity = 25;
    }
};

GameCore.prototype.playerUpdateAttributes = function(id, x, y, x_velocity, y_velocity) {
    // player_id, move to x, move to y
    // move a player to a new x, y
    let p = this.players[id];
    p.x = x;
    p.y = y;
    if (x_velocity !== undefined) {
        p.x_velocity = x_velocity;
    }
    if (y_velocity !== undefined) {
        p.y_velocity = y_velocity;
    }
};

if (typeof global != "undefined") {
    module.exports = GameCore;
}

/* Player class */
class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.y_velocity = 25;
        this.x_velocity = 0;
    }
}