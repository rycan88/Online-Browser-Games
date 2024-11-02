const Matter = require('matter-js');

const World = Matter.World;
const Bodies = Matter.Bodies;

const defaultCategory = 0x0001;
const playerCategory = 0x0002;
class Box {
    constructor(x, y, w, h, world, isStatic=true) {
        this.body = Bodies.rectangle(x, y, w, h, {isStatic: isStatic, restitution: 0, friction: 0, slop: 0, inertia: Infinity, collisionFilter: {category: defaultCategory, mask: playerCategory}});
        World.add(world, this.body);
    }
}

module.exports = {
    Box,
};
