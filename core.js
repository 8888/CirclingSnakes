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
    this.players = []; // array of player ids
}

GameCore.prototype.init = function() {
    console.log("init"); // placeholder
}

GameCore.prototype.update = function(delta) {
    this.gameDelta = delta;
}

GameCore.prototype.display = function() {
    this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

    // draw names
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "24px Verdana";
    for (var user = 0; user < this.players.length; user++) {
        this.ctx.fillText(
            this.players[user],
            100,
            100 + (36 * user)
        );
    }
}

// export GameCore() so it is callable from a require
if (typeof global != "undefined") { // do this only on server-side
    module.exports = GameCore;
}