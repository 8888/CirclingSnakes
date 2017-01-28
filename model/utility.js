'use strict';

let Utility = {
    DIRECTION_WEST: 0b1,
    DIRECTION_NORTH: 0b10,
    DIRECTION_EAST: 0b100,
    DIRECTION_SOUTH: 0b1000,
    directionReverse: {},
    directionVelocity: {},
    directions: [],
    directionsEW: [],
    directionsNS: []
};

Utility.directionReverse[Utility.DIRECTION_NORTH] = Utility.DIRECTION_SOUTH;
Utility.directionReverse[Utility.DIRECTION_SOUTH] = Utility.DIRECTION_NORTH;
Utility.directionReverse[Utility.DIRECTION_EAST] = Utility.DIRECTION_WEST;
Utility.directionReverse[Utility.DIRECTION_WEST] = Utility.DIRECTION_EAST;

Utility.directionVelocity[Utility.DIRECTION_NORTH] = [0, -25];
Utility.directionVelocity[Utility.DIRECTION_SOUTH] = [0, 25];
Utility.directionVelocity[Utility.DIRECTION_EAST] = [25, 0];
Utility.directionVelocity[Utility.DIRECTION_WEST] = [-25, 0];

Utility.directions = [Utility.DIRECTION_NORTH, Utility.DIRECTION_EAST, Utility.DIRECTION_SOUTH, Utility.DIRECTION_WEST];
Utility.directionsEW = [Utility.DIRECTION_EAST, Utility.DIRECTION_WEST];
Utility.directionsNS = [Utility.DIRECTION_NORTH, Utility.DIRECTION_SOUTH];

module.exports = Utility;