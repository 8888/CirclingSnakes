'use strict';

let Utility = require('./utility.js');

class Segment {
    constructor(x, y, direction, waypoints, size) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error('Valid X, Y required together');
        } else if (typeof direction !== 'undefined' && Utility.directions.indexOf(direction) == -1) {
            throw new Error('Valid direction required, when provided');
        } else if (waypoints === null || ['undefined', 'object'].indexOf(typeof waypoints) == -1) {
            throw new Error('Valid waypoint required, when provided');
        } else if (typeof size !== 'undefined' && (!Number.isFinite(size) || size <= 0)) {
            throw new Error('Valid size required, when provided');
        }

        this.x = x;
        this.y = y;
        this.direction = typeof direction !== 'undefined' ? direction : Utility.DIRECTION_EAST;
        this.waypoints = typeof waypoints !== 'undefined' ? waypoints : [];
        this.size = typeof size !== 'undefined' ? size : 20;
    }

    waypointAdd(x, y, direction) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error('Valid X, Y required together');
        } else if (typeof direction !== 'undefined' && Utility.directions.indexOf(direction) == -1) {
            throw new Error('Valid direction required');
        }
        this.waypoints.push({
            x: x,
            y: y,
            direction: direction
        });
    }
}

module.exports = Segment;