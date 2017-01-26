'use strict';
let chai = require('chai'),
    expect = chai.expect;

let c = require('../model/core.js');

let intgerRange = [];
describe('GameCore.constructor', function() {
    it('has integer width', function() {
        expect(new c(12, 12))
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
        expect(new c(12, 12))
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
        expect(new c(12, 12))
            .property('players')
            .a('object')
            .empty;
    });
});

describe('GameCore.playerCreate', function() {
    it('requires valid id');
    it('produces valid x');
    it('produces valid y');
});

describe('GameCore.playerAdd', function() {
    it('requires valid player');
    it('does not previously contain player');
    it('inserts player (contains, count increase)');
});

describe('GameCore.playerDelete', function() {
    it('requires valid id');
    it('does contain player');
    it('deletes player (not contains, count descrease)');
});

describe('GameCore.playerUpdateEntity', function() {
    it('requires valid player');
    it('replaces player');
    it('keeps player count the same');
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