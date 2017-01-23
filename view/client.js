/* client-side only code
 *  Attach user interface to server events
 *  Display server results
 */
'use strict';
let GameCore = require('../core.js');
let socket = io(),
    game = new GameCore(640, 640);
// TODO: width/height should be passed back from server
// after the client has joined a game.

// Client Attributes
let playerId = null,
    isConnected = false;

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
    game.playerUpdateAttributes(playerId, mouseX, mouseY);
    socket.emit('player_moved', playerId, mouseX, mouseY);
});

canvas.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - canvasBounds.left;
    mouseY = event.clientY - canvasBounds.top;
    /*
    game.playerUpdateAttributes(player.id, mouseX, mouseY);
    socket.emit('player_moved', player.id, mouseX, mouseY);
    */
});

/* Server Events */
socket.on('connect', function() {
    console.log("Connected as", socket.id);
    isConnected = true;
});

socket.on('connect_error', function(err) {
    console.log('!!! Error connecting to server');
    isConnected = false;
});

socket.on('game_join', function(data) {
    /* { player: object,
     *   players: [object] }*/
    playerId = data.player.id;
    game.players = data.players;
    keyDownEvents = {
        37: function() { playerUpdateVelocity(playerId, game.left); },
        38: function() { playerUpdateVelocity(playerId, game.up); },
        39: function() { playerUpdateVelocity(playerId, game.right); },
        40: function() { playerUpdateVelocity(playerId, game.down); }
    };
});

function playerUpdateVelocity(id, direction) {
    game.playerUpdateVelocity(id, 0, direction);
    let p = game.players[id];
    socket.emit('player_moved', id, p.segments[0].x, p.segments[0].y, p.segments[0].x_velocity, p.segments[0].y_velocity);
}

socket.on('player_add', function(data) {
    /* { player: object } */
    game.playerAdd(data.player);
});

socket.on('player_update_attributes', function(data) {
    /* { playerId: string,
     *   x: float,
     *   y: float,
     *   x_velocity: float,
     *   y_velocity: float } */
    game.playerUpdateAttributes(data.playerId, data.x, data.y, data.x_velocity, data.y_velocity);
});

socket.on('player_delete', function(data) {
    /* { playerId: string } */
    game.playerDelete(data.playerId);
});

socket.on('update_player_list', function(data) {
    game.players = data.players;
});

function playersAdd(count) {
    // add players without assigning a client
    // test purposes only
    for (let p = 0; p < count; p++) {
        let id = Math.trunc(Math.random() * 10000);
        socket.emit('playerAdd', id);
    }
}

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

    /* HUD */
    if (playerId) {
        ctx.font = "30px New Courier";
        let playerName = ctx.measureText(playerId);
        ctx.fillStyle = "rgba(130, 65, 160, 0.8)";
        ctx.fillText(playerId, (canvasWidth - playerName.width) / 2, 45);
        if (!isConnected) {
            ctx.font = "18px New Courier";
            ctx.fillStyle = "black";
            let text = ">>Not connected!",
                mText = ctx.measureText(text);
            ctx.beginPath();
            ctx.rect(0, 0, mText.width, 24);
            ctx.fill();
            ctx.fillStyle = "rgba(250, 65, 65, 0.8)";
            ctx.fillText(text, 0, 20);
        }
    }

    /* PLAYERS */
    ctx.font = "18px New Courier";
    for (let user in game.players) {
        let p = game.players[user];
        for (let segment = 0; segment < p.segments.length; segment++) {
            if (Math.trunc(p.segments[segment].y) == 320) {
                ctx.fillStyle = "rgba(250, 10, 10, 0.9)";
            } else if(p.id == playerId) {
                ctx.fillStyle = "rgba(130, 65, 160, 0.8)";
            } else {
                ctx.fillStyle = "rgba(250, 250, 250, 0.65)";
            }
            ctx.fillRect(
                p.segments[segment].x,
                p.segments[segment].y, 
                p.segments[segment].size, 
                p.segments[segment].size
            );
            ctx.fillStyle = "rgba(10, 10, 10, 0.8)";
            ctx.fillText(
                (segment ? segment : p.id.slice(0,6)) + "(" + Math.trunc(p.segments[segment].x) + ", " + Math.trunc(p.segments[segment].y) + ")", 
                p.segments[segment].x, 
                p.segments[segment].y
            );
        }   
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