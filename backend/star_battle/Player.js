const planck = require('planck-js');
const { Box } = require('./Box');

const defaultCategory = 0x0001;
const playerCategory = 0x0002;

const fps = 80;
const SCALE = 1 / 50; // 1 meter per 50 pixels

const WIDTH = 45;
const HEIGHT  = 45;

const normalSpeed = 5;
const moveForce = 300;

class Player {
    constructor(x, y, mapDimensions, world, playerNum) {
        this.body = world.createBody({
            type: "dynamic",
            position: planck.Vec2(x * SCALE, y * SCALE),
            fixedRotation: true,
        })
        
        this.body.setSleepingAllowed(false);
        this.body.createFixture(planck.Box(SCALE * (WIDTH / 2), SCALE * (HEIGHT / 2 - 1)), { density: 2.0, friction: 0.1, restitution: 0})

        // Curves so the player does not get stuck on edges
        this.body.createFixture(planck.Circle(planck.Vec2(0, -SCALE * ((HEIGHT - WIDTH) / 2 + 0.5)), SCALE * WIDTH / 2), { density: 0, friction: 0, restitution: 0, userData: ""})
        this.body.createFixture(planck.Circle(planck.Vec2(0, SCALE * ((HEIGHT - WIDTH) / 2 + 0.5)), SCALE * WIDTH / 2), { density: 0, friction: 0, restitution: 0, userData: ""})

        // Ground Sensor
        this.body.createFixture(planck.Box(SCALE * (WIDTH / 2 - 0.5), SCALE * 2, planck.Vec2(0, SCALE * (HEIGHT / 2 + 1))), { density: 0, friction: 0, restitution: 0, userData: "playerGroundSensor", isSensor: true})
        

        // Star Sensors
        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2, planck.Vec2(-mapDimensions[0], 0)), { density: 0, friction: 0, restitution: 0, userData: "playerBodySensor", isSensor: true})
        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2, planck.Vec2(0, 0)), { density: 0, friction: 0, restitution: 0, userData: "playerBodySensor", isSensor: true})
        this.body.createFixture(planck.Box(SCALE * WIDTH / 2, SCALE * HEIGHT / 2, planck.Vec2(mapDimensions[0], 0)), { density: 0, friction: 0, restitution: 0, userData: "playerBodySensor", isSensor: true})
        
        this.body.topCollisions = [];
        this.body.starsCollected = 0;

        this.playerNum = playerNum;
        this.currentFrame = 0;
        this.respawning = {bool: false, startFrame: 0};
        this.jumping = {bool: false, startFrame: 0};
        this.groundPounding = {bool: false, startFrame: 0, position: [0, 0]};
    }

    getPosition() {
        return this.body.getPosition();
    }

    getVelocity() {
        return this.body.getLinearVelocity();
    }

    setVelocityX(velocityX) {
        const newVelocity = planck.Vec2(velocityX, this.getVelocity().y)
        this.body.setLinearVelocity(newVelocity);  
    }

    setVelocityY(velocityY) {
        const newVelocity = planck.Vec2(this.getVelocity().x, velocityY);
        this.body.setLinearVelocity(newVelocity);   
    }

    setVelocity(x, y) {
        const newVelocity = planck.Vec2(x, y);
        this.body.setLinearVelocity(newVelocity); 
    }

    setPositionX(positionX) {
        const newPosition = planck.Vec2(positionX, this.getPosition().y);
        this.body.setPosition(newPosition);        
    }

    setPosition(x, y) {
        const newPosition = planck.Vec2(x, y);
        this.body.setPosition(newPosition); 
    }

    isOnGround() {
        return this.body.topCollisions.length !== 0;
    }

    up(keyStatus) {
        if (this.isOnGround() && keyStatus) {
            this.jump();
        } else if (!keyStatus){
            this.stopJump();
        }
    }

    down() {

    }

    horizontalMovement(direction, isRunning) {
        if (direction === 0) {
            this.slowDown();
            return;
        }

        const maxSpeed = isRunning ? normalSpeed * 1.5 : normalSpeed;

        let velX = this.getVelocity().x;

        if (Math.sign(velX) === -direction && Math.abs(velX) > 1) {
            velX *= 0.9;
            this.setVelocityX(velX);
        }

        if (Math.abs(velX) < maxSpeed) {
            const force = planck.Vec2(direction * moveForce * SCALE, 0);
            this.body.applyForceToCenter(force);
        } else {
            velX = direction * maxSpeed; 
            this.setVelocityX(velX);
        }
    }

    slowDown() {
        const playerVelocity = this.getVelocity();
        const damping = 0.95;
        this.setVelocityX(playerVelocity.x * damping);
    }

    jump() {
        this.jumping = {bool: true, startFrame: this.currentFrame};
        this.body.applyLinearImpulse(planck.Vec2(0, -1275 * SCALE), this.getPosition(), true);
    }

    stopJump() {
        if (this.jumping.bool && this.currentFrame - this.jumping.startFrame <= 0.45 * fps) {
            this.setVelocityY(this.getVelocity().y / 3);
        }
    }

    crouch() {

    }

    uncrouch() {

    }

    groundPound() {
        if (this.groundPounding.bool) { return; }
        this.groundPounding = {bool: true, startFrame: this.currentFrame, position: this.getPosition()};
    }

    update(mapPixels) {
        if (this.respawning.bool) {
            if (this.currentFrame - this.respawning.startFrame < 1 * fps) {
                this.setPosition(200 + 200 * this.playerNum * SCALE, 50 * SCALE); 
                this.setVelocity(0, 0);
            } else {
                this.respawning.bool = false;
            }
        }

        if (this.body.topCollisions.length !== 0) {
            if (this.groundPounding.bool && this.groundPounding.startFrame < this.currentFrame - 2) {
                this.groundPounding.bool = false;
            }
            if (this.jumping.bool && this.jumping.startFrame < this.currentFrame - 2) {
                this.jumping.bool = false;
            }
        }

        if (this.groundPounding.bool) {
            if (this.currentFrame - this.groundPounding.startFrame < 0.25 * fps) {
                this.setPosition(this.groundPounding.position.x, this.groundPounding.position.y); 
                this.setVelocity(0, 0);
            } else {
                //this.setPositionX(this.groundPounding.position[0]); 
                this.setVelocity(0, 20);               
            }
        }
        this.loopPosition(mapPixels);
        this.checkRespawn(mapPixels);
        
    }

    // Makes sure that the player stays on the map
    loopPosition(mapPixels) {
        const newPositionX = mod(this.getPosition().x, mapPixels[0]);
        if (this.getPosition().x !== newPositionX) {
            this.setPositionX(newPositionX);
        }
    }

    checkRespawn(mapPixels) {
        if (this.getPosition().y >= mapPixels[1] + 150 * SCALE) {
            console.log("RESPAWNED")
            this.respawning = {bool: true, startFrame: this.currentFrame};
            this.jumping = {bool: false, startFrame: 0};
            this.groundPounding = {bool: false, startFrame: 0, position: [0, 0]};
        }
    }


}

const mod = (n, m) => {
    if (n < 0) {
        return ((n % m) + m) % m; 
    } 

    return n % m;
}

module.exports = {
    Player,
};
