'use strict';

class Fruit {
    constructor(id, x, y, radius) {
        if (typeof id !== "string" || id.length === 0) {
            throw new Error('Parameter \'id\' required of type string');
        } else if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error('Valid X, Y required together');
        }
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

module.exports = Fruit;