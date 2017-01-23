'use strict';
let chai = require('chai'),
    expect = chai.expect;

let p = require('../player.js');

describe('Player.constructor', function() {
    it('has id');
    it('has x');
    it('has y');
    it('has segments', function() {
        expect(new p(1, 1, 1)) // id, x, y
            .property('segments')
            .a('array')
            .lengthOf(1);
    });
});