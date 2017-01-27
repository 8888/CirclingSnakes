'use strict';
let chai = require('chai'),
    expect = chai.expect;

let c = require('../model/core.js'),
    Player = require('../model/player.js'),
    Fruit = require('../model/fruit.js');

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
    it('requires positive delta');
    it('applies velocity based on delta');
    it('advances segment past starting location');
    it('does not move player outside board');
    it('kills player moving into walls');
    it('moves each segment in their direction');
    it('turns each segment at waypoint');
});

describe('GameCore.playerUpdateVelocity', function() {
    it('requires valid player');
    it('requires valid segment');
    it('requires perpendicular direction');
    it('does not change segment count');
    it('updates only `segment` direction');
    it('propagates turn to next segment');
});

describe('GameCore.playerUpdateAttributes', function() {
    it('requires valid player id');
    it('requires existing player');
    it('requires existing player with atleast one segment');
    it('requires valid direction if provided');
    it('requires valid x');
    it('requires valid y');
});

describe('GameCore.playersList', function() {
    it('returns array, length matches players count');
    it('items are type Player');
    it('items represent all GameCore Players');
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
    it('returns array, length matches fruits count');
    it('items are type Player');
    it('items represent all GameCore Fruits');
});