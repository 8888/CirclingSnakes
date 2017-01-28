'use strict';
let chai = require('chai'),
    expect = chai.expect;

let s = require('../model/segment.js'),
    u = require('../model/utility.js');

describe('Segment.constructor', function() {
    it('valid x, y ', function() {
        expect(function() { new s(null, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(undefined, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s("seven", 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(Infinity, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(7, null); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(7, undefined); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(7, "seven"); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new s(7, Infinity); })
            .throw(Error, 'Valid X, Y required together');
        expect(new s(7, 7))
            .instanceOf(s);
    });
    it('requires valid direction when provided');
    it('sets default direction when not provided');
    it('requires valid waypoints when provided');
    it('sets default waypoints when not provided');
    it('requires valid size when provided');
    it('sets default size when not provided');
});

describe('Segment.waypointAdd', function() {
    let segment = null;
    beforeEach(function() {
        segment = new s(10, 10);
    });
    it('requires valid x, y ', function() {
        expect(function() { segment.waypointAdd(null, 7, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(undefined, 7, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd("seven", 7, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(Infinity, 7, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(7, null, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(7, undefined, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(7, "seven", u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { segment.waypointAdd(7, Infinity, u.DIRECTION_WEST); })
            .throw(Error, 'Valid X, Y required together');
        expect(segment.waypointAdd(7, 7, u.DIRECTION_WEST))
            .instanceOf(s);
    });
    it('requires valid direction');
});