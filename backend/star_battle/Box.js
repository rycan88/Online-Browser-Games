const planck = require("planck-js");

const defaultCategory = 0x0001;
const playerCategory = 0x0002;
const SCALE = 1 / 50 // 1 meter = 50px 
class Box {
    constructor(x, y, w, h, world, isStatic=true) {
        this.body = world.createBody({
            type: isStatic ? "static" : "dynamic",
            position: planck.Vec2(x * SCALE, y * SCALE),
            fixedRotation: true,
        })

        this.body.createFixture(planck.Box(SCALE * w / 2, SCALE * h / 2), { density: isStatic ? 0 : 2.0, friction: 0, restitution: 0})
    }
}

module.exports = {
    Box,
};
