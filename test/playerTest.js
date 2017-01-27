'use strict';
let chai = require('chai'),
    expect = chai.expect;

let u = require('../model/utility.js'),
    p = require('../model/player.js'),
    g = require('../model/core.js');

describe('Player.constructor', function() {
    let player = null,
        playerId = "adsf";
    beforeEach(function() {
        player = new p(playerId);
    });

    it('has id', function() {
        expect(player)
            .property('id')
            .equals(playerId);
    });
    it('has empty segments', function() {
        expect(player)
            .property('segments')
            .a('array')
            .empty;
    });
    it('has first segments', function() {
        expect(new p(playerId, 1, 1))
            .property('segments')
            .a('array')
            .lengthOf(1);
    });
});

describe('Player.segmentAdd', function() {
    let player = null;
    beforeEach(function() {
        player = new p("asdf");
    });

    it('valid x, y when provided', function() {
        expect(function() { player.segmentAdd(null, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(undefined, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd("seven", 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(Infinity, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(7, null); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(7, undefined); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(7, "seven"); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { player.segmentAdd(7, Infinity); })
            .throw(Error, 'Valid X, Y required together');
    });
    it('disallow first add without x, y', function() {
        expect(function() { player.segmentAdd(); })
            .throw(Error, 'First segment must provide x and y');
    });
    it('increase segment count', function() {
        player.segmentAdd(1, 1);
        expect(player)
            .property('segments')
            .a('array')
            .length(1);
    });
    it('direction is same or perpendicular to previous', function () {
        player.segmentAdd(1, 1);
        let s0 = player.segments[0];
        for(let d in u.directions) {
            let s0 = player.segments[player.segments.length - 1];
            player.segmentAdd(1, 1, d);
            let s1 = player.segments[player.segments.length - 1];
            expect(s0).property('direction');
            expect(s1).property('direction');
            expect(s1.direction == s0.direction ||
                s1.direction != u.directionReverse[s0.direction]
            );
        }
    });
    it('disallow reverse to previous', function() {
        for(let d in u.directions) {
            player.segmentAdd(1, 1, d);
            expect(function() { player.segmentAdd(1, 1, u.directionReverse[d]); })
                .throw(Error, 'Direction must not be reverse previous segment');
        }
    });
    it('adds to last segment w same direction', function() {
        player.segmentAdd(1, 1);
        let s0 = player.segments[0];
        player.segmentAdd();
        let s1 = player.segments[1];
        expect(s1.direction)
            .equals(s0.direction);
    });
});