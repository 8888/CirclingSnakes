/* server-side only code */
'use strict';

// create a server-side instance of GameCore
var game_core = require('./core.js');
var game = new game_core(true); // GameCore(is_server)

// TODO: at this point game_server.js is redundant and just passing to index.js
module.exports = game;

// TODO: create a server-side specific loop
/*
// game loop
game.init();
var mainloop_updateLast = Date.now();
// TODO: window.performance.now() won't work with node, investigate option besides Date.now()
(function mainLoop(nowTime) {
    game.update(nowTime - mainloop_updateLast);
    mainloop_updateLast = nowTime;
    setInterval(mainLoop, 100); // window.requestAnimationFrame won't work in node.
    // TODO: node.js timers --> this will be fully reworked. Currently arbitrary 100 ms. use delta etc.
})(Date.now());
*/