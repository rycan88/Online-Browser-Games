const Matter = require('matter-js');
const { Box } = require('./Box');

const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const defaultCategory = 0x0001;
const playerCategory = 0x0002;

const fps = 80;
class Player extends Box {
    constructor(x, y, world, playerNum, isStatic=false) {
        super(x, y, 50, 100, world, isStatic);
        this.body.collisionFilter = {category: playerCategory, mask: defaultCategory | playerCategory, group: 1};
        this.body.isSensor = true;
        this.body.topCollisions = [];

        this.playerNum = playerNum;
        this.currentFrame = 0;
        this.respawning = {bool: false, startFrame: 0};
        this.jumping = {bool: false, startFrame: 0};
        this.groundPounding = {bool: false, startFrame: 0, position: [0, 0]};
    }

    setVelocityX(velocityX) {
        Body.setVelocity(this.body, {x: velocityX, y: this.body.velocity.y});  
    }

    setVelocityY(velocityY) {
        Body.setVelocity(this.body, {x: this.body.velocity.x, y: velocityY});  
    }

    setVelocity(x, y) {
        Body.setVelocity(this.body, {x: x, y: y});  
    }

    setPositionX(positionX) {
        Body.setPosition(this.body, {x: positionX, y: this.body.position.y});         
    }

    setPosition(x, y) {
        Body.setPosition(this.body, {x: x, y: y});
    }

    jump() {
        this.jumping = {bool: true, startFrame: this.currentFrame};
        this.setVelocityY(-17);
    }

    stopJump() {
        if (this.jumping.bool && this.currentFrame - this.jumping.startFrame <= 0.25 * fps) {
            this.setVelocityY(this.body.velocity.y / 2);
        }
    }

    crouch() {

    }

    uncrouch() {

    }

    groundPound() {
        if (this.groundPounding.bool) { return; }
        this.groundPounding = {bool: true, startFrame: this.currentFrame, position: [this.body.position.x, this.body.position.y]};
    }

    update(mapPixels) {
        if (this.respawning.bool) {
            if (this.currentFrame - this.respawning.startFrame < 1 * fps) {
                this.setPosition(200 + 200 * this.playerNum, 50); 
                this.setVelocity(0, 0);
            } else {
                this.respawning.bool = false;
            }
        }

        if (this.body.topCollisions.length !== 0) {
            if (this.groundPounding.bool) {
                console.log("GROUND HIT", this.body.position.y)
            }
            if (this.jumping.bool) {
                console.log("GROUND HIT", this.body.position.y)
            }
            this.jumping.bool = false;
            this.groundPounding.bool = false;
        }

        if (this.groundPounding.bool) {
            if (this.currentFrame - this.groundPounding.startFrame < 0.25 * fps) {
                this.setPosition(this.groundPounding.position[0], this.groundPounding.position[1]); 
                this.setVelocity(0, 0);
            } else {
                //this.setPositionX(this.groundPounding.position[0]); 
                this.setVelocity(0, 30);               
            }
        }
        this.loopPosition(mapPixels);
        this.checkRespawn(mapPixels);
    }

    // Makes sure that the player stays on the map
    loopPosition(mapPixels) {
        const newPositionX = mod(this.body.position.x, mapPixels[0]);
        if (this.body.position.x !== newPositionX) {
            this.setPositionX(newPositionX);
        }
    }

    checkRespawn(mapPixels) {
        if (this.body.position.y >= mapPixels[1] + 150) {
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
