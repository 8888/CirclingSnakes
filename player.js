'use strict';

let Segment = require('./segment.js');
/* Player class */
class Player {
    constructor(id, x, y) {
        this.id = id;
        this.segments = [];
        if (Number.isFinite(x) && Number.isFinite(y)) {
            this.segmentAdd(x, y);
        }
    }

    segmentAdd(x, y, x_velocity, y_velocity, waypoints, size) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
            this.segments.push(new Segment(x, y, x_velocity, y_velocity, waypoints, size));
        } else {
            let s = this.segments[this.segments.length - 1];
            this.segments.push(new Segment(
                s.x + -1 * Math.sign(s.x_velocity) * s.size,
                s.y + -1 * Math.sign(s.y_velocity) * s.size,
                s.x_velocity, s.y_velocity, [], s.size
            ));
        }
    }
}

if (typeof global != "undefined") {
    module.exports = Player;
}