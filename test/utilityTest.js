'use strict';
let chai = require('chai'),
    expect = chai.expect;

let Utility = require('../model/utility.js');

describe('Utility.checkRectangularCollision', function() {
    it('detects collision', function() {
        expect(Utility.checkRectangularCollision({x: 10, y: 10, width: 10, height: 10}, {x: 10, y: 10, width: 10, height: 10})).equal(true);
        expect(Utility.checkRectangularCollision({x: 10, y: 10, width: 10, height: 10}, {x: 12, y: 12, width: 4, height: 4})).equal(true);
        expect(Utility.checkRectangularCollision({x: 12, y: 12, width: 4, height: 4}, {x: 10, y: 10, width: 10, height: 10})).equal(true);
        expect(Utility.checkRectangularCollision({x: 10, y: 10, width: 10, height: 10}, {x: 8, y: 8, width: 4, height: 4})).equal(true);
        expect(Utility.checkRectangularCollision({x: 8.5, y: 6, width: 20, height: 20}, {x: -3, y: -4, width: 20, height: 20})).equal(true);
        expect(Utility.checkRectangularCollision({x: 10, y: 10, width: 10, height: 10}, {x: 2, y: 2, width: 3, height: 3})).equal(false);
        expect(Utility.checkRectangularCollision({x: 2, y: 2, width: 3, height: 3}, {x: 10, y: 10, width: 10, height: 10})).equal(false);
        expect(Utility.checkRectangularCollision({x: 2, y: 2, width: 3, height: 3}, {x: 5.1, y: 5.1, width: 10, height: 10})).equal(false);
    });
});