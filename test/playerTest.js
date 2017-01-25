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
        expect( new p(playerId, 1, 1))
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

    it('disallow first add without x, y', function() {
        expect(player.segmentAdd())
            .throw(Error);
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
        let directions = [u.left, u.up, u.right, u.down];
        for(let d in directions) {
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
    it('adds to last segment w same direction', function() {
        player.segmentAdd(1, 1);
        let s0 = player.segments[0];
        player.segmentAdd();
        let s1 = player.segments[1];
        expect(s1.direction)
            .equals(s0.direction);
    });
});