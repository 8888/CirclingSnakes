/* client-side: Attach user interface to server events */
/* global io */
'use strict';
let GameCore = require('../model/core.js'),
    Segment = require('../model/segment.js'),
    Player = require('../model/player.js'),
    Utility = require('../model/utility.js'),
    Fruit = require('../model/fruit.js');
let socket = io(),
    game = new GameCore(640, 640);
// TODO: width/height should be passed back from server

// Client Attributes
let playerId = null;
let clientDisplay = null,
    connectionDisplay = null;

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

/* Server Events */
socket.on('connect', function() { connectionDisplay.innerText=""; });
socket.on('connect_error', function(err) { connectionDisplay.innerText="Not Connected!"; });
socket.on('gameJoin', function(data) {
    /* { player: object, players: [object], fruit: [object] }*/
    playerId = data.playerId;
    clientDisplay.innerText = playerId;
    for(let i = 0; i < data.players.length; i++) {
        game.playerAdd(playerFromData(data.players[i]));
    }

    function playerUpdateVelocity(id, direction) {
        game.playerUpdateVelocity(id, 0, direction);
        socket.emit('playerTurn', id, direction);
    }

    for(let i = 0; i < data.fruits.length; i++) {
        game.fruitAdd(fruitFromData(data.fruits[i]));
    }

    keyDownEvents = {
        37: function() { playerUpdateVelocity(playerId, Utility.DIRECTION_WEST); },
        38: function() { playerUpdateVelocity(playerId, Utility.DIRECTION_NORTH); },
        39: function() { playerUpdateVelocity(playerId, Utility.DIRECTION_EAST); },
        40: function() { playerUpdateVelocity(playerId, Utility.DIRECTION_SOUTH); }
    };
});

function playerFromData(playerData) {
    let p = new Player(playerData.id);
    for (let i = 0; i < playerData.segments.length; i++) {
        let s = playerData.segments[i];
        p.segmentAdd(s.x, s.y,
            s.direction,
            s.waypoints,
            s.size
        );
    }

    return p;
}

function fruitFromData(fruitData) {
    let f = new Fruit(fruitData.id, fruitData.x, fruitData.y);
    return f;
}

socket.on('playerTurn', function(data) {
    /* { playerId: int, direction: int } */
    game.playerUpdateVelocity(data.playerId, 0, data.direction);
});
socket.on('playerAdd', function(data) {
    /* { player: object } */
    game.playerAdd(playerFromData(data.player));
});
socket.on('playerDelete', function(data) {
    /* { playerId: string } */
    game.playerDelete(data.playerId);
});
socket.on('playersUpdate', function(data) {
    for(let i = 0; i < data.players.length; i++) {
        let p = playerFromData(data.players[i]);
        if (game.players[p.id]) {
            game.playerUpdateEntity(p);
        } else {
            game.playerAdd(p);
        }
    }
});

socket.on('fruitAdd', function(data) {
    /* { fruit: object } */
    game.fruitAdd(fruitFromData(data.fruit));
});
socket.on('fruitUpdate', function(data) {
    for(let i = 0; i < data.fruits.length; i++) {
        let f = fruitFromData(data.fruits[i]);
        if (game.fruits[f.id]) {
            game.fruitUpdateEntity(f);
        } else {
            game.fruitAdd(f);
        }
    }
});

// Development features
function playersAdd(count) {
    // add serverside players
    for (let p = 0; p < count; p++) {
        socket.emit('playerAdd', Math.trunc(Math.random() * 10000));
    }
}

// Init, Update, Display, Loop
function init() {
    clientDisplay = document.getElementById('clientName');
    connectionDisplay = document.getElementById('connectionStatus');
}

function update(delta) {
    for (let user in game.players) {
        game.playerUpdate(user, delta);
        if (game.fruits) {
            game.checkFruitCollision(game.players[user]);
        }
        game.checkWallCollision(game.players[user]);
    }
}

function display() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw players
    ctx.font = "18px New Courier";
    for (let user in game.players) {
        let p = game.players[user];
        for (let i = 0; i < p.segments.length; i++) {
            let s = p.segments[i];
            if (Math.trunc(s.y) == 320) {
                ctx.fillStyle = "rgba(250, 10, 10, 0.9)";
            } else if(p.id == playerId) {
                ctx.fillStyle = "rgba(130, 65, 160, 0.8)";
            } else {
                ctx.fillStyle = "rgba(250, 250, 250, 0.65)";
            }
            ctx.fillRect(s.x, s.y, s.size, s.size);
            ctx.fillStyle = "rgba(10, 10, 10, 0.8)";
            ctx.fillText(
                (i ? i : p.id.slice(0,6)) + "(" + Math.trunc(s.x) + ", " + Math.trunc(s.y) + ")", 
                s.x, s.y
            );
        }   
    }

    ctx.fillStyle = "rgba(250, 10, 10, 0.9)";
    for (let fruit in game.fruits) {
        let f = game.fruits[fruit];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, 2*Math.PI);
        ctx.fill();
    }

    // Center line
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