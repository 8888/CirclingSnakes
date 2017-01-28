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
        let segment = new s(7, 7);
        expect(segment)
            .instanceOf(s)
            .property('x')
            .equal(7);
        expect(segment)
            .instanceOf(s)
            .property('y')
            .equal(7);
    });
    it('requires valid direction when provided', function() {
        expect(function() { new s(7, 7, null); })
            .throw(Error, 'Valid direction required, when provided');
        expect(function() { new s(7, 7, 12345); })
            .throw(Error, 'Valid direction required, when provided');
        expect(function() { new s(7, 7, "seven"); })
            .throw(Error, 'Valid direction required, when provided');
        expect(function() { new s(7, 7, Infinity); })
            .throw(Error, 'Valid direction required, when provided');
        for(let i = 0, l = u.directions.length; i < l; i++) {
            let d = u.directions[i];
            let segment = new s(7, 7, d);
            expect(segment)
                .instanceOf(s)
                .property('direction')
                .equal(d);
        }
    });
    it('sets default direction when not provided', function() {
        expect(new s(7, 7))
            .instanceof(s)
            .property('direction')
            .equal(u.DIRECTION_EAST);
    });
    it('requires valid waypoints when provided', function() {
        expect(function() { new s(7, 7, undefined, null); })
            .throw(Error, 'Valid waypoint required, when provided');
        expect(function() { new s(7, 7, undefined, 12345); })
            .throw(Error, 'Valid waypoint required, when provided');
        expect(function() { new s(7, 7, undefined, "seven"); })
            .throw(Error, 'Valid waypoint required, when provided');
        expect(function() { new s(7, 7, undefined, Infinity); })
            .throw(Error, 'Valid waypoint required, when provided');
        expect(new s(7, 7, undefined, [{ x: 7, y: 7, direction: u.DIRECTION_NORTH}]))
            .instanceof(s)
            .property('waypoints')
            .a('array')
            .length(1);
    });
    it('sets default waypoints when not provided', function() {
        expect(new s(7, 7))
            .instanceof(s)
            .property('waypoints')
            .a('array')
            .length(0);
        expect(new s(7, 7, u.DIRECTION_NORTH, undefined, 30))
            .instanceof(s)
            .property('waypoints')
            .a('array')
            .length(0);
    });
    it('requires valid size when provided', function() {
        expect(function() { new s(7, 7, undefined, undefined, null); })
            .throw(Error, 'Valid size required, when provided');
        expect(function() { new s(7, 7, undefined, undefined, -12); })
            .throw(Error, 'Valid size required, when provided');
        expect(function() { new s(7, 7, undefined, undefined, 0); })
            .throw(Error, 'Valid size required, when provided');
        expect(function() { new s(7, 7, undefined, undefined, "seven"); })
            .throw(Error, 'Valid size required, when provided');
        expect(function() { new s(7, 7, undefined, undefined, Infinity); })
            .throw(Error, 'Valid size required, when provided');
        expect(new s(7, 7, undefined, undefined, 12))
            .instanceOf(s)
            .property('size')
            .equal(12);
    });
    it('sets default size when not provided', function() {
        expect(new s(7, 7))
            .instanceof(s)
            .property('size')
            .equal(20);
    });
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
        segment.waypointAdd(7, 7, u.DIRECTION_WEST);
    });
    it('requires valid direction', function() {
        expect(function() { segment.waypointAdd(7, 7, null); })
            .throw(Error, 'Valid direction required');
        expect(function() { segment.waypointAdd(7, 7, 12345); })
            .throw(Error, 'Valid direction required');
        expect(function() { segment.waypointAdd(7, 7, "seven"); })
            .throw(Error, 'Valid direction required');
        expect(function() { segment.waypointAdd(7, 7, Infinity); })
            .throw(Error, 'Valid direction required');
        for(let i = 0, l = u.directions.length; i < l; i++) {
            let d = u.directions[i];
            segment.waypointAdd(7, 7, d);
        }
    });
    it('adds to the end and increases count', function() {
        for(let i = 0, l = u.directions.length; i < l; i++) {
            let d = u.directions[i];
            segment.waypointAdd(7, 7, d);
            expect(segment)
                .property('waypoints')
                .length(i + 1);
            expect(segment.waypoints[i])
                .property('direction')
                .equals(d);
        }
    });
});