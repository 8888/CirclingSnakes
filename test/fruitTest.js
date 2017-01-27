'use strict';
let chai = require('chai'),
    expect = chai.expect;

let f = require('../model/fruit.js');

describe('Fruit.constructor', function() {
    let fruit = null,
        fruitId = "adsf";
    beforeEach(function() {
        fruit = new f(fruitId, 7, 7);
    });

    it('require valid id', function() {
        expect(function() { new f(); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { new f(null); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { new f(undefined); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { new f([]); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { new f(''); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(function() { new f(3982); })
            .throw(Error, 'Parameter \'id\' required of type string');
        expect(fruit)
            .instanceof(f)
            .property('id')
            .equals(fruitId);
    });

    it('valid x, y ', function() {
        expect(function() { new f(fruitId, null, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, undefined, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, "seven", 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, Infinity, 7); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, 7, null); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, 7, undefined); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, 7, "seven"); })
            .throw(Error, 'Valid X, Y required together');
        expect(function() { new f(fruitId, 7, Infinity); })
            .throw(Error, 'Valid X, Y required together');
        expect(new f(fruitId, 7, 7))
            .instanceOf(f);
    });
    it('has positive radius', function() {
        expect(fruit)
            .property('radius')
            .above(0);
        expect(Number.isFinite(fruit.radius));
    });
});
