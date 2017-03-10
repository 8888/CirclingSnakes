'use strict';
let Segment = require('./segment.js'),
    Utility = require('./utility.js');

class Player {
    constructor(id, x, y) {
        if (typeof id !== "string" || id.length === 0) {
            throw new Error('Parameter \'id\' required of type string');
        }
        this.id = id;
        this.segments = [];
        this.isAlive = true;
        this.wallsKill = true;
        this.selfCollisionKills = false;
        this.enemyCollisionKills = false;
        if (Number.isFinite(x) && Number.isFinite(y)) {
            this.segmentAdd(x, y);
        }
    }

    segmentAdd(x, y, direction, waypoints, size) {
        if (Number.isFinite(x) || Number.isFinite(y)) {
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                throw new Error('Valid X, Y required together');
            }
            if (this.segments.length !== 0) {
                let s = this.segments[this.segments.length - 1];
                if (Utility.directionReverse[s.direction] == direction) {
                    throw new Error('Direction must not be reverse previous segment');
                }
            }

            this.segments.push(new Segment(x, y, direction, waypoints, size));
        } else if (this.segments.length === 0) {
            throw new Error('First segment must provide x and y');
        } else {
            let s = this.segments[this.segments.length - 1];
            let v = Utility.directionVelocity[s.direction];
            this.segments.push(new Segment(
                s.x + -1 * Math.sign(v[0]) * s.size,
                s.y + -1 * Math.sign(v[1]) * s.size,
                s.direction, [], s.size
            ));
        }
    }

    kill() {
        this.isAlive = false;
    }
}

module.exports = Player;