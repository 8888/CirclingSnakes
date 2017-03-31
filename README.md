# CirclingSnakes
A canvas based, multiplayer version of the classic snake game.

This is a work in progress using Express (webserver) and Socket.IO (real-time communication) to create a multiplayer environment. The server is established and connections are then made using a localhost. Each connection creates a new player and spawns a snake into the world to be controlled from that tab. There is no connection/player limit, and sessions have been run using thousands of simultaneous connections without issues.

Classic gameplay is available, with randomly spawning fruit that increases the length of the snake that collects it. Snakes are killed by colliding with other snakes, the walls, or themselves. After death, the player is respawned but without any gathered increased lengths.

The server and the local browser both continuously run the game logic. The localhost initially makes predictions to allow for a smooth display. The server runs the same logic and regularly updates all of the users to keep all of the game state the same. If there are any discrepencies between the states of the local user and the server, the local user will update to the server's newly sent data.

The current graphics are dev style to allow for effective and quick development of game and network logic. They are drawn using an HTML5 canvas.


## Screenshots
<img src="https://github.com/betterin30days/CirclingSnakes/blob/documentation/screenshots/singleuser.JPG"><br>
<img src="https://github.com/betterin30days/CirclingSnakes/blob/documentation/screenshots/multiuser.JPG"><br>


## How to build
1. `npm install`
2. `browserify view/client.js -o view/bundle.js`
2. `node server/index`
3. Connect on localhost:3000 (default port)


## How to run tests
1. You built the code with the above `npm install`
2. `mocha`

Mocha is the runner and reporter of tests that are defined by Chai.


## Viewing code coverage reports
1. You built the code with the above `npm install`
2. `istanbul cover node_modules/mocha/bin/_mocha -- -R spec`
3. Report will be generated at /coverage/lcov-report/index.html


## Current Test status
Istanbul Coverage summary:<br>
Statements   : 90.29% ( 251/278 )<br>
Branches     : 89.61% ( 207/231 )<br>
Functions    : 88.89% ( 24/27 )<br>
Lines        : 90.29% ( 251/278 )<br>
