'use strict';

class Fruit {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 10;
    }
}

if (typeof global != "undefined") {
    module.exports = Fruit;
}