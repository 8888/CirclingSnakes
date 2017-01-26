'use strict';

let Utility = require('./utility.js');

class Segment {
    constructor(x, y, direction, waypoints, size) {
        this.x = x;
        this.y = y;
        this.direction = typeof direction !== 'undefined' ? direction : Utility.DIRECTION_EAST;
        this.waypoints = typeof waypoints !== 'undefined' ? waypoints : [];
        this.size = typeof size !== 'undefined' ? size : 20;
    }

    waypointAdd(x, y, direction) {
        this.waypoints.push({
            x: x,
            y: y,
            direction: direction
        });
    }
}

module.exports = Segment;