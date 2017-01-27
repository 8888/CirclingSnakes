# CirclingSnakes
A canvas based, multiplayer version of the classic snake game.

This is a work in progress using Express (webserver) and Socket.IO (real-time communication) to create a multiplayer environement.

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