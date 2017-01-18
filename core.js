/*
 * This contains all of the game logic shared by the client and server.
*/
'use strict';

/* GameCore class */
var GameCore = function() {
    // game core to be run on clients and server
    this.players = {};
};

GameCore.prototype.playerCreate = function(id) {
    // TODO: pass in game parameters: width, height;
    let p = new Player(id, Math.trunc(Math.random() * 250), Math.trunc(Math.random() * 250));
    this.playerAdd(p);
    return p;
};

GameCore.prototype.playerAdd = function(player) {
    console.log("core.playerAdd", player.id);
    this.players[player.id] = player;
};

GameCore.prototype.playerDelete = function(id) {
    console.log("core.playerDelete", id);
    delete this.players[id];
}

GameCore.prototype.playerUpdate = function(id, delta) {
    // TODO: pass in game area (640 x 640)
    let p = this.players[id],
        x = p.x,
        y = p.y + p.y_velocity * delta / 1000;
    if (y > 640) {
        y = 640 - (y - 640);
        p.y_velocity *= -1;
    } else if (y < 0) {
        y = 0 - y;
        p.y_velocity *= -1;
    }
    p.x = x;
    p.y = y;
}

GameCore.prototype.move_player = function(id, x, y) {
    // player_id, move to x, move to y
    // move a player to a new x, y
    let p = this.players[id];
    p.x = x;
    p.y = y;
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
    }
}