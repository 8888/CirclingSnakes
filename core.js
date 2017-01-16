/*
This contains all of the game logic.
This is used by the client and the server so everyone is using the same functions.
*/
'use strict';

/* GameCore class */
var GameCore = function(is_server) {
    // game core to be run on clients and server
    this.is_server = is_server;
    this.gameDelta = null; // delta for time usage
    this.client_id = null; // clients are assigned an id, server remains null
    this.players = {} // client_id: player object
    this.client_player = null; // individual player object belonging to that client
}

GameCore.prototype.init = function() {
    console.log("init"); // placeholder
}

GameCore.prototype.update = function(delta) {
    this.gameDelta = delta;
}

GameCore.prototype.display = function() {
    this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

    // draw a circle for each player
    this.ctx.fillStyle = "#ffffff";
    for (let user in this.players) {
        this.ctx.beginPath();
        this.ctx.arc(
            this.players[user].x,
            this.players[user].y,
            25,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
}

GameCore.prototype.server_add_player = function(id) {
    let new_player = new Player(id, 100, 100);
    this.players[id] = new_player; //  client_id: player_object
    return new_player;
}

GameCore.prototype.move_player = function(player_id, x, y) { // player_id, move to x, move to y
    // move a player to a new x, y
    this.players[player_id].x = x;
    this.players[player_id].y = y;
}

// export GameCore() so it is callable from a require
if (typeof global != "undefined") { // do this only on server-side
    module.exports = GameCore;
}

/* Player class */
class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}