'use strict';

let Utility = {
    DIRECTION_WEST: 0b1,
    DIRECTION_NORTH: 0b10,
    DIRECTION_EAST: 0b100,
    DIRECTION_SOUTH: 0b1000,
    directionReverse: {
        0b1 : 0b100,
        0b100 : 0b1,
        0b10 : 0b1000,
        0b1000 : 0b10
    }
};

module.export = Utility;