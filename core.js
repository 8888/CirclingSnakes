
/*
This will containt all of the main game logic.
This will get used by the client and the server so everyone is using the same functions.
This will hold game state on the client and the server

As of now, we are drawing on the server as well, this is not correct
-When each instance is created, !server will receive drawing
-There needs to be game objects etc
-Add loops to check for handling input, updating, displaying
*/



'use strict';
// canvas parameters
var canvas = document.getElementById("canvasElement");
canvas.tabIndex = 0;
canvas.focus();
var canvas_width = canvas.width;
var canvas_height = canvas.height;
var canvas_bounds = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");

// game parameters
var players = [];


/* Listen for server events */
socket.on('onconnected', function(id) {
    socket.emit('added_player', id);
})

socket.on('added_player', function(id) {
    players.push(id);
    draw_names();
})

function draw_names() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Verdana";
    for (var user = 0; user < players.length; user++) {
        ctx.fillText(
            players[user],
            100,
            100 + (36 * user)
        );
    }
}