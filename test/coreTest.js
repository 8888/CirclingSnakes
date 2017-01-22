'use strict';
let chai = require('chai'),
    expect = chai.expect;

let c = require('../core.js');

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