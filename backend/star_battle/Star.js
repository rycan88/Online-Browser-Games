const planck = require("planck-js");

const SCALE = 1 / 50 // 1 meter = 50px 
const HEIGHT = 100;
const WIDTH = 100;
class Star {
    constructor(x, y, mapPixels, world, isStatic=true) {
        this.body = world.createBody({
            type: "kinematic",
            position: planck.Vec2(x * SCALE, y * SCALE),
            fixedRotation: true,
        })

        this.body.setUserData("star");

        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2), { density: isStatic ? 0 : 2.0, friction: 0, restitution: 0, isSensor: true})

        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2, planck.Vec2(-mapPixels[0] * SCALE, 0)), { density: isStatic ? 0 : 2.0, friction: 0, restitution: 0, isSensor: true})
        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2, planck.Vec2(mapPixels[0] * SCALE, 0)), { density: isStatic ? 0 : 2.0, friction: 0, restitution: 0, isSensor: true})


        
        if (!Star.gravityExemptBodies) {
            Star.gravityExemptBodies = new Set();
        }
        Star.gravityExemptBodies.add(this.body);
    }
    
    getPosition() {
        return this.body.getPosition();
    }

    setPosition(x, y) {
        const newPosition = planck.Vec2(x, y);
        this.body.setPosition(newPosition); 
    }

    static neutralizeGravity(world) {
        const gravity = world.getGravity();

        Star.gravityExemptBodies.forEach((body) => {
            const antiGravity = gravity.clone().mul(-body.getMass());
            body.applyForceToCenter(antiGravity);
        });
    }
}

module.exports = {
    Star,
};