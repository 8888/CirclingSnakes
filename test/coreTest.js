'use strict';
let chai = require('chai'),
    expect = chai.expect;

let c = require('../model/core.js'),
    Player = require('../model/player.js'),
    Fruit = require('../model/fruit.js'),
    Utility = require('../model/utility.js');

let intgerRange = [];
describe('GameCore.constructor', function() {
    let gameCore = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
    });
    it('has integer width', function() {
        expect(gameCore)
            .property('width')
            .a('number')
            .equal(12);
    });
    it('negative width parameters throw', function() {
        expect(function() { new c(-12, 12); })
            .throw(Error, 'Width must be positive integer');
        expect(function() { new c(null, 12); })
            .throw(Error, 'Width must be positive integer');
        expect(function() { new c(undefined, 12); })
            .throw(Error, 'Width must be positive integer');
        expect(function() { new c("12", 12); })
            .throw(Error, 'Width must be positive integer');
    });
    it('has integer height', function() {
        expect(gameCore)
            .property('height')
            .a('number')
            .equal(12);
    });
    it('negative height parameters throw', function() {
        expect(function() { new c(12, -12); })
            .throw(Error, 'Height must be positive integer');
        expect(function() { new c(12, null); })
            .throw(Error, 'Height must be positive integer');
        expect(function() { new c(12, undefined); })
            .throw(Error, 'Height must be positive integer');
        expect(function() { new c(12, "12"); })
            .throw(Error, 'Height must be positive integer');
    });
    it('has empty players', function() {
        expect(gameCore)
            .property('players')
            .a('object');
        expect(Object.keys(gameCore.players))
            .length(0);
    });
    it('has empty fruit', function() {
        expect(gameCore)
            .property('fruits')
            .a('object');
        expect(Object.keys(gameCore.fruits))
            .length(0);
    });
    it('has positive fruit limit', function() {
        expect(gameCore)
            .property('fruitMax')
            .above(0);
    });
    it('has positive, reasonable fruit spawn interval', function() {
        expect(gameCore)
            .property('fruitSpawnInterval')
            .within(100, 30000);
    });
});

describe('GameCore.playerCreate', function() {
    let gameCore = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
    });
    it('requires valid id', function() {
        expect(function() { gameCore.playerCreate(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerCreate(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerCreate(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerCreate([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerCreate(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerCreate(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(gameCore.playerCreate("number1"))
            .instanceof(Player);
    });
});

describe('GameCore.playerAdd', function() {
    let gameCore = null,
        player = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 12, 12);
    });
    it('requires valid player', function() {
        expect(function() { gameCore.playerAdd(); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerAdd(null); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerAdd(undefined); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerAdd([]); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerAdd(''); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerAdd(3982); })
            .throw(Error, 'Parameter \'player\' required of type Player');
    });
    it('updates players with entity', function() {
        gameCore.playerAdd(player);
        expect(gameCore.players[player.id]).equal(player);
    });
    it('does not previously contain player', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerAdd(player); })
            .throw(Error, 'Duplicate player id cannot be added');
    });
    it('inserts increases players count', function() {
        gameCore.playerAdd(player);
        expect(Object.keys(gameCore.players)).length(1);
        gameCore.playerAdd(new Player("fdas", 12, 12));
        expect(Object.keys(gameCore.players)).length(2);
    });
});

describe('GameCore.playerDelete', function() {
    let gameCore = null,
        player = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 12, 12);
    });
    it('requires valid id', function() {
        expect(function() { gameCore.playerDelete(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerDelete(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerDelete(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerDelete([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerDelete(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerDelete(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
        gameCore.playerAdd(player);
        gameCore.playerDelete(player.id);
    });
    it('does contain player', function() {
        expect(function() { gameCore.playerDelete("asdf"); })
            .throw(Error, 'Player does not exist to delete');
    });
    it('deletes player (not contains, count descrease)', function() {
        gameCore.playerAdd(player);
        gameCore.playerDelete(player.id);
        expect(Object.keys(gameCore.players)).length(0);
    });
});

describe('GameCore.playerUpdateEntity', function() {
    let gameCore = null,
        player = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 12, 12);
    });
    it('requires valid player', function() {
        expect(function() { gameCore.playerUpdateEntity(); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerUpdateEntity(null); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerUpdateEntity(undefined); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerUpdateEntity([]); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerUpdateEntity(''); })
            .throw(Error, 'Parameter \'player\' required of type Player');
        expect(function() { gameCore.playerUpdateEntity(3982); })
            .throw(Error, 'Parameter \'player\' required of type Player');
    });
    it('does contain player', function() {
        expect(function() { gameCore.playerUpdateEntity(player); })
            .throw(Error, 'Player does not exist to update');
    });
    it('updates players with entity', function() {
        gameCore.playerAdd(player);
        gameCore.playerUpdateEntity(player);
        expect(gameCore.players[player.id]).equal(player);
    });
    it('keeps player count the same', function() {
        gameCore.playerAdd(player);
        gameCore.playerUpdateEntity(player);
        expect(Object.keys(gameCore.players)).length(1);
    });
});

describe('GameCore.playerUpdate', function() {
    let gameCore = null,
        player = null,
        fruit = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 6, 6);
        fruit = new Fruit("zxcv", 7, 6);
    });
    it('requires positive delta', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdate(player.id); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
        expect(function() { gameCore.playerUpdate(player.id, null); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
        expect(function() { gameCore.playerUpdate(player.id, undefined); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
        expect(function() { gameCore.playerUpdate(player.id, 0); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
        expect(function() { gameCore.playerUpdate(player.id, -1); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
        expect(function() { gameCore.playerUpdate(player.id, "1"); })
            .throw(Error, 'Parameter \'delta\' required to be positive');
    });
    it('applies velocity based on delta', function() {
        gameCore.playerAdd(player);
        player.segments[0].direction = Utility.DIRECTION_EAST;
        gameCore.playerUpdate("asdf", 100);
        expect(player.segments[0].x).equal(8.5);
        player.segments[0].direction = Utility.DIRECTION_SOUTH;
        gameCore.playerUpdate("asdf", 100);
        expect(player.segments[0].y).equal(8.5);
    });
    it('advances segment past starting location', function() {
        gameCore.playerAdd(player);
        for (let d = 0; d < Utility.directions.length; d++) {
            player.segments[0].direction = Utility.directions[d];
            if (Utility.directionsEW.indexOf(Utility.directions[d]) != -1) {
                expect(function() { gameCore.playerUpdate(player.id, 20); })
                    .change(player.segments[0], 'x');
            } else {
                expect(function() { gameCore.playerUpdate(player.id, 20); })
                    .change(player.segments[0], 'y');
            }
        }
    });
    it('does not move player outside board', function() {
        gameCore.playerAdd(player);
        player.segments[0].x = 11;
        gameCore.playerUpdate("asdf", 100);
        expect(player.segments[0].x).most(gameCore.width);
    });
    it('kills player moving into walls', function() {
        gameCore.playerAdd(player);
        player.segments[0].x = 11;
        gameCore.playerUpdate("asdf", 100);
        expect(gameCore.players).not.property('asdf');
    });
    it('moves each segment in their direction', function() {
        gameCore.playerAdd(player);
        player.segmentAdd();
        expect(function() { gameCore.playerUpdate("asdf", 100); })
            .change(player.segments[1], 'x');
    });
    it('turns each segment at waypoint', function() {
        gameCore.playerAdd(player);
        player.segments[0].size = 2;
        player.segmentAdd(undefined, undefined, undefined, 2);
        player.segments[0].direction = Utility.DIRECTION_SOUTH;
        player.segments[1].waypoints.push({x: 6, y: 6, direction: Utility.DIRECTION_SOUTH});
        expect(function() { gameCore.playerUpdate("asdf", 100); })
            .change(player.segments[1], 'direction');
    });
});

describe('GameCore.playerUpdateVelocity', function() {
    let gameCore = null,
        player = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 12, 12);
    });
    it('requires valid id', function() {
        expect(function() { gameCore.playerUpdateVelocity(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateVelocity(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateVelocity(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateVelocity([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateVelocity(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateVelocity(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
    });
    it('requires existing player', function() {
        expect(function() { gameCore.playerUpdateVelocity("asdf"); })
            .throw(Error, 'Player does not exist to update velocity of');
    });
    it('requires valid segment', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateVelocity("asdf"); })
            .throw(Error, 'Parameter \'segment\' required of type number');
        expect(function() { gameCore.playerUpdateVelocity("asdf", null); })
            .throw(Error, 'Parameter \'segment\' required of type number');
        expect(function() { gameCore.playerUpdateVelocity("asdf", undefined); })
            .throw(Error, 'Parameter \'segment\' required of type number');
        expect(function() { gameCore.playerUpdateVelocity("asdf", []); })
            .throw(Error, 'Parameter \'segment\' required of type number');
        expect(function() { gameCore.playerUpdateVelocity("asdf", ''); })
            .throw(Error, 'Parameter \'segment\' required of type number');
        expect(function() { gameCore.playerUpdateVelocity("asdf", "asdf"); })
            .throw(Error, 'Parameter \'segment\' required of type number');
    });
    it('requires existing segment', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateVelocity("asdf", 2); })
            .throw(Error, 'Segment does not exist to update velocity of');
    });
    it('requires valid turn', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, null); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, undefined); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, []); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, ''); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, "asdf"); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateVelocity("asdf", 0, 0b11); })
            .throw(Error, 'Parameter \'turn\' required of type number in Utility.directions');
    });
    it('requires perpendicular direction', function() {
        gameCore.playerAdd(player);
        for (let d = 0; d < Utility.directions.length; d++) {
            player.segments[0].direction = Utility.directions[d];
            expect(function() { gameCore.playerUpdateVelocity(player.id, 0, Utility.directions[d]); })
                .throw(Error, 'Provided direction must be perpendicular to current direction');
            expect(function() { gameCore.playerUpdateVelocity(player.id, 0, Utility.directionReverse[Utility.directions[d]]); })
                .throw(Error, 'Provided direction must be perpendicular to current direction');
        }
    });
    it('does not change segment count', function() {
        gameCore.playerAdd(player);
        let count = player.segments.length;
        gameCore.playerUpdateVelocity(player.id, 0, Utility.DIRECTION_NORTH);
        expect(count).equal(player.segments.length);
    });
    it('updates only `segment` direction', function() {
        gameCore.playerAdd(player);
        let x = player.segments[0].x,
            y = player.segments[0].y,
            s = player.segments[0].size;
        gameCore.playerUpdateVelocity(player.id, 0, Utility.DIRECTION_NORTH);
        expect(player.segments[0].x).equal(x);
        expect(player.segments[0].y).equal(y);
        expect(player.segments[0].size).equal(s);
    });
    it('propagates turn to next segment', function() {
        gameCore.playerAdd(player);
        gameCore.playerUpdateVelocity(player.id, 0, Utility.DIRECTION_NORTH);
        for (let s = 0; s < player.segments.length; s++) {
            expect(player.segments[s].direction).equal(Utility.DIRECTION_NORTH);
        }
    });
});

describe('GameCore.playerUpdateAttributes', function() {
    let gameCore = null,
        player = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 12, 12);
    });
    it('requires valid player id', function () {
        expect(function() { gameCore.playerUpdateAttributes(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateAttributes(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateAttributes(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateAttributes([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateAttributes(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.playerUpdateAttributes(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
    });
    it('requires existing player', function() {
        expect(function() { gameCore.playerUpdateAttributes("asdf"); })
            .throw(Error, 'Player does not exist to update attributes of');
    });
    it('requires existing player with atleast one segment', function() {
        gameCore.playerAdd(player);
        player.segments = [];
        expect(function() { gameCore.playerUpdateAttributes("asdf"); })
            .throw(Error, 'Player requires atleast one segment');
    });
    it('requires valid direction if provided', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 12, null); })
            .throw(Error, 'Parameter \'direction\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 12, []); })
            .throw(Error, 'Parameter \'direction\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 12, ''); })
            .throw(Error, 'Parameter \'direction\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 12, "asdf"); })
            .throw(Error, 'Parameter \'direction\' required of type number in Utility.directions');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 12, 0b11); })
            .throw(Error, 'Parameter \'direction\' required of type number in Utility.directions');
    });
    it('requires valid x', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateAttributes("asdf"); })
            .throw(Error, 'Parameter \'x\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", null); })
            .throw(Error, 'Parameter \'x\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", undefined); })
            .throw(Error, 'Parameter \'x\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", []); })
            .throw(Error, 'Parameter \'x\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", ''); })
            .throw(Error, 'Parameter \'x\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", "asdf"); })
            .throw(Error, 'Parameter \'x\' required of type number');
    });
    it('requires valid y', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12); })
            .throw(Error, 'Parameter \'y\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, null); })
            .throw(Error, 'Parameter \'y\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, undefined); })
            .throw(Error, 'Parameter \'y\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, []); })
            .throw(Error, 'Parameter \'y\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, ''); })
            .throw(Error, 'Parameter \'y\' required of type number');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, "asdf"); })
            .throw(Error, 'Parameter \'y\' required of type number');
    });
    it('does not move player outside board', function() {
        gameCore.playerAdd(player);
        expect(function() { gameCore.playerUpdateAttributes("asdf", 15, 12); })
            .not.change(player.segments[0], 'x');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 15, 12); })
            .not.change(player.segments[0], 'y');
        expect(function() { gameCore.playerUpdateAttributes("asdf", -1, 12); })
            .not.change(player.segments[0], 'x');
        expect(function() { gameCore.playerUpdateAttributes("asdf", -1, 12); })
            .not.change(player.segments[0], 'y');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 15); })
            .not.change(player.segments[0], 'x');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, 15); })
            .not.change(player.segments[0], 'y');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, -1); })
            .not.change(player.segments[0], 'x');
        expect(function() { gameCore.playerUpdateAttributes("asdf", 12, -1); })
            .not.change(player.segments[0], 'y');
    });
});

describe('GameCore.playersList', function() {
    let gameCore = null,
        playerA = null,
        playerB = null,
        playerC = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        playerA = new Player("asdf", 12, 12);
        playerB = new Player("bsdf", 8, 8);
        playerC = new Player("csdf", 4, 4);
    });
    it('returns array, length matches players count', function() {
        gameCore.playerAdd(playerA);
        gameCore.playerAdd(playerB);
        gameCore.playerAdd(playerC);
        expect(gameCore.playersList()).length(3);
    });
    it('items are type Player', function() {
        expect(function() {
            gameCore.players.asdf = null;
            gameCore.playersList();
        })
            .throw(Error, 'Items required of type Player');
        expect(function() {
            gameCore.players.asdf = undefined;
            gameCore.playersList();
        })
            .throw(Error, 'Items required of type Player');
        expect(function() {
            gameCore.players.asdf = 'asdf';
            gameCore.playersList();
        })
            .throw(Error, 'Items required of type Player');
        expect(function() {
            gameCore.players.asdf = 1234;
            gameCore.playersList();
        })
            .throw(Error, 'Items required of type Player');
    });
    it('items represent all GameCore Players', function() {
        gameCore.playerAdd(playerA);
        gameCore.playerAdd(playerB);
        gameCore.playerAdd(playerC);
        let playersList = gameCore.playersList();
        for (let p in gameCore.players) {
            expect(playersList).contain(gameCore.players[p]);
        }
    });
});

describe('GameCore.fruitCreate', function() {
    let gameCore = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
    });
    it('requires valid id', function() {
        expect(function() { gameCore.fruitCreate(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitCreate(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitCreate(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitCreate([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitCreate(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitCreate(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(gameCore.fruitCreate("number1"))
            .instanceof(Fruit);
    });
    it('does not create on existing fruit or snake');
});

describe('GameCore.fruitAdd', function() {
    let gameCore = null,
        fruit = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        fruit = new Fruit("asdf", 12, 12);
    });
    it('requires valid fruit', function() {
        expect(function() { gameCore.fruitAdd(); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitAdd(null); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitAdd(undefined); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitAdd([]); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitAdd(''); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitAdd(3982); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
    });
    it('updates fruits with entity', function() {
        gameCore.fruitAdd(fruit);
        expect(gameCore.fruits[fruit.id]).equal(fruit);
    });
    it('does not previously contain fruit', function() {
        gameCore.fruitAdd(fruit);
        expect(function() { gameCore.fruitAdd(fruit); })
            .throw(Error, 'Duplicate fruit id cannot be added');
    });
    it('inserts increases fruits count', function() {
        gameCore.fruitAdd(fruit);
        expect(Object.keys(gameCore.fruits)).length(1);
        gameCore.fruitAdd(new Fruit("fdas", 12, 12));
        expect(Object.keys(gameCore.fruits)).length(2);
    });
});

describe('GameCore.fruitDelete', function() {
    let gameCore = null,
        fruit = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        fruit = new Fruit("asdf", 12, 12);
    });
    it('requires valid id', function() {
        expect(function() { gameCore.fruitDelete(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitDelete(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitDelete(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitDelete([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitDelete(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { gameCore.fruitDelete(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
        gameCore.fruitAdd(fruit);
        gameCore.fruitDelete(fruit.id);
    });
    it('does contain fruit', function() {
        expect(function() { gameCore.fruitDelete("asdf"); })
            .throw(Error, 'Fruit does not exist to delete');
    });
    it('deletes fruit (not contains, count descrease)', function() {
        gameCore.fruitAdd(fruit);
        gameCore.fruitDelete(fruit.id);
        expect(Object.keys(gameCore.fruits)).length(0);
    });
});

describe('GameCore.fruitUpdateEntity', function() {
    let gameCore = null,
        fruit = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        fruit = new Fruit("asdf", 12, 12);
    });
    it('requires valid fruit', function() {
        expect(function() { gameCore.fruitUpdateEntity(); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitUpdateEntity(null); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitUpdateEntity(undefined); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitUpdateEntity([]); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitUpdateEntity(''); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
        expect(function() { gameCore.fruitUpdateEntity(3982); })
            .throw(Error, 'Parameter \'fruit\' required of type Fruit');
    });
    it('does contain fruit', function() {
        expect(function() { gameCore.fruitUpdateEntity(fruit); })
            .throw(Error, 'Fruit does not exist to update');
    });
    it('updates fruits with entity', function() {
        gameCore.fruitAdd(fruit);
        gameCore.fruitUpdateEntity(fruit);
        expect(gameCore.fruits[fruit.id]).equal(fruit);
    });
    it('keeps fruit count the same', function() {
        gameCore.fruitAdd(fruit);
        gameCore.fruitUpdateEntity(fruit);
        expect(Object.keys(gameCore.fruits)).length(1);
    });
});

describe('GameCore.fruitList', function() {
    let gameCore = null,
        fruitA = null,
        fruitB = null,
        fruitC = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        fruitA = new Fruit("asdf", 12, 12);
        fruitB = new Fruit("bsdf", 12, 12);
        fruitC = new Fruit("csdf", 12, 12);
    });
    it('returns array, length matches fruits count', function() {
        gameCore.fruitAdd(fruitA);
        gameCore.fruitAdd(fruitB);
        gameCore.fruitAdd(fruitC);
        expect(gameCore.fruitList()).length(3);     
    });
    it('items are type Fruit', function() {
        expect(function() {
            gameCore.fruits.asdf = null;
            gameCore.fruitList();
        })
            .throw(Error, 'Items required of type Fruit');
        expect(function() {
            gameCore.fruits.asdf = undefined;
            gameCore.fruitList();
        })
            .throw(Error, 'Items required of type Fruit');
        expect(function() {
            gameCore.fruits.asdf = 'asdf';
            gameCore.fruitList();
        })
            .throw(Error, 'Items required of type Fruit');
        expect(function() {
            gameCore.fruits.asdf = 1234;
            gameCore.fruitList();
        })
            .throw(Error, 'Items required of type Fruit');
    });
    it('items represent all GameCore Fruits', function() {
        gameCore.fruitAdd(fruitA);
        gameCore.fruitAdd(fruitB);
        gameCore.fruitAdd(fruitC);
        let fruitList = gameCore.fruitList();
        for (let f in gameCore.fruits) {
            expect(fruitList).contain(gameCore.fruits[f]);
        }
    });
});

describe('GameCore.checkFruitCollision', function() {
    let gameCore = null,
        player = null,
        fruit = null;
    beforeEach(function() {
        gameCore = new c(12, 12);
        player = new Player("asdf", 6, 6);
        fruit = new Fruit("zxcv", 6, 6);
    });
    it('removes fruit upon collision', function() {
        gameCore.playerAdd(player);
        gameCore.fruitAdd(fruit);
        gameCore.checkFruitCollision(player);
        expect(gameCore.fruits).not.property("zxcv");
    });
    it('collecting fruit increases segment length', function() {
        gameCore.playerAdd(player);
        gameCore.fruitAdd(fruit);
        gameCore.checkFruitCollision(player);
        expect(player).property("segments").lengthOf(2);
    });
});