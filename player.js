'use strict';

/* Player class */
class Player {
    constructor(id, x, y) {
        this.id = id;
        this.segments = [new Segment(x, y), new Segment(x, y-20)];
    }
}

class Segment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x_velocity = 0;
        this.y_velocity = 25;
        this.velocity_change_x = null;
        this.velocity_change_y = null;
        this.velocity_change_direction = null;
        this.size = 20; // length and width
    }
}

if (typeof global != "undefined") {
    module.exports = Player;
}