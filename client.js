/* client-side only code */
'use strict';

// create a client-side instance of GameCore
var game = new GameCore(false); // GameCore(is_server)

// establish the canvas and the parameters
game.canvas = document.getElementById("canvasElement");
game.canvas.tabIndex = 0;
game.canvas.focus();
game.canvas_width = game.canvas.width;
game.canvas_height = game.canvas.height;
game.canvas_bounds = game.canvas.getBoundingClientRect();
game.ctx = game.canvas.getContext("2d");
// mouse parameters
game.mouseX = null;
game.mouseY = null;

// create event listeners to handle user input
game.canvas.addEventListener("mousedown", function(event) {

});
game.canvas.addEventListener("mousemove", function(event) {
    game.mouseX = event.clientX - game.canvas_bounds.left;
    game.mouseY = event.clientY - game.canvas_bounds.top;
});

/* handle socket.io events */
// socket = io(); established in index.html --> use socket as reference
socket.on('user_connected', function(id) {
    game.client_id = id;
    console.log("Your ID is: ", game.client_id);
});

socket.on('update_player_list', function(updated_players) {
    game.players = updated_players;

    // send feedback to server, to be used for sending data, input, etc to the server
    socket.emit('received_players', game.client_id);
})

// game loop
window.onload = function() {
    game.init();
    var mainloop_updateLast = performance.now();
    (function mainLoop(nowTime) {
        game.update(nowTime - mainloop_updateLast);
        game.display();
        mainloop_updateLast = nowTime;
        requestAnimationFrame(mainLoop);
    })(performance.now());
}