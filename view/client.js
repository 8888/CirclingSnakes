/* client-side only code
 *  Attach user interface to server events
 *  Display server results
 */
'use strict';
let socket = io(),
    game = new GameCore();

// Client Attributes
let playerId = null;

// View: Canvas / DOM
let canvas = document.getElementById("canvasElement");
canvas.tabIndex = 0;
canvas.focus();
let canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    canvasBounds = canvas.getBoundingClientRect(),
    ctx = canvas.getContext("2d");
let mouseX = null,
    mouseY = null;

/* Event Handlers */
let keyDownEvents = null;
window.addEventListener("keydown", function(event) {
    if (keyDownEvents) {
        let f = keyDownEvents[event.keyCode.toString()];
        if (f) { f(); }
    }
});

canvas.addEventListener("mousedown", function(event) {
    game.move_player(playerId, mouseX, mouseY);
    socket.emit('player_moved', playerId, mouseX, mouseY);
});

canvas.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - canvasBounds.left;
    mouseY = event.clientY - canvasBounds.top;
    /*
    game.move_player(player.id, mouseX, mouseY);
    socket.emit('player_moved', player.id, mouseX, mouseY);
    */
});

/* Server Events */
socket.on('connect', function() {
    console.log("Connected as", socket.id);
});

socket.on('connect_error', function(err) {
    console.log('!!! Error connecting to server');
});

socket.on('game_join', function(data) {
    /* { player: object,
     *   players: [object] }*/
    playerId = data.player.id;
    game.players = data.players;
});

socket.on('player_add', function(data) {
    /* { player: object } */
    game.playerAdd(data.player);
});

socket.on('player_update_xy', function(data) {
    /* { playerId: string,
     *   x: int,
     *   y: int } */
    game.move_player(data.playerId, data.x, data.y);
});

socket.on('player_delete', function(data) {
    /* { playerId: string } */
    game.playerDelete(data.playerId);
});

socket.on('update_player_list', function(data) {
    game.players = data.players;
});

// Init, Update, Display, Loop
function init() {

}

function update(delta) {
    for (let user in game.players) {
        game.playerUpdate(user, delta);
    }
}

function display() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (playerId) {
        ctx.font = "30px New Courier";
        let playerName = ctx.measureText(playerId);
        ctx.fillStyle = "rgba(130, 65, 160, 0.8)";
        ctx.fillText(playerId, (canvasWidth - playerName.width) / 2, 45);
    }

    ctx.font = "18px New Courier";
    for (let user in game.players) {
        let p = game.players[user];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 25, 0, 2 * Math.PI);
        if (Math.trunc(p.y) == 320) {
            ctx.fillStyle = "rgba(250, 10, 10, 0.9)";
        } else if(p.id == playerId) {
            ctx.fillStyle = "rgba(130, 65, 160, 0.8)";
        } else {
            ctx.fillStyle = "rgba(250, 250, 250, 0.65)";
        }
        ctx.fill();
        ctx.fillStyle = "rgba(10, 10, 10, 0.8)";
        ctx.fillText(p.id, p.x, p.y);
        ctx.fillText("(" + p.x + ", " + Math.trunc(p.y) + ")", p.x, p.y + 20);
    }

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(640, 320);
    ctx.stroke();
}

window.onload = function() {
    init();
    var mainloop_updateLast = performance.now();
    (function mainLoop(nowTime) {
        update(nowTime - mainloop_updateLast);
        display();
        mainloop_updateLast = nowTime;
        requestAnimationFrame(mainLoop);
    })(performance.now());
};