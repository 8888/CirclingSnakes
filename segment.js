'use strict';

class Segment {
    constructor(x, y, x_velocity, y_velocity, waypoints, size) {
        this.x = x;
        this.y = y;
        this.x_velocity = typeof x_velocity !== 'undefined' ? x_velocity : 0;
        this.y_velocity = typeof y_velocity !== 'undefined' ? y_velocity : 25;
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

if (typeof global !== 'undefined') {
    module.exports = Segment;
}