const planck = require("planck-js");

const SCALE = 1 / 50 // 1 meter = 50px 
class Box {
    constructor(x, y, w, h, mapPixels, world, isStatic=true) {
        this.body = world.createBody({
            type: isStatic ? "static" : "dynamic",
            position: planck.Vec2(x * SCALE, y * SCALE),
            fixedRotation: true,
        })

        this.body.setUserData("block");

        this.body.createFixture(planck.Box(SCALE * w / 2, SCALE * h / 2), { density: isStatic ? 0 : 2.0, friction: 0, restitution: 0});
        
        this.body.createFixture(planck.Box(SCALE * w / 2, SCALE * h / 2, planck.Vec2(-mapPixels[0] * SCALE, 0)), { density: isStatic ? 0 : 0, friction: 0, restitution: 0});
        this.body.createFixture(planck.Box(SCALE * w / 2, SCALE * h / 2, planck.Vec2(mapPixels[0] * SCALE, 0)), { density: isStatic ? 0 : 0, friction: 0, restitution: 0});
    }
}

module.exports = {
    Box,
};
