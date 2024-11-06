const Matter = require('matter-js');
const { Box } = require('./Box');

const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const defaultCategory = 0x0001;
const playerCategory = 0x0002;
class Player extends Box {
    constructor(x, y, world, playerNum, isStatic=false) {
        super(x, y, 48, 100, world, isStatic);
        this.body.collisionFilter = {category: playerCategory, mask: defaultCategory | playerCategory, group: 1};
        this.body.topCollisions = [];
        this.playerNum = playerNum;
    }

    setVelocityX(velocityX) {
        Body.setVelocity(this.body, {x: velocityX, y: this.body.velocity.y});  
    }

    setVelocityY(velocityY) {
        Body.setVelocity(this.body, {x: this.body.velocity.x, y: velocityY});  
    }

    setPositionX(positionX) {
        Body.setPosition(this.body, {x: positionX, y: this.body.position.y});         
    }

    respawn() {
        Body.setPosition(this.body, {x: 200 + 200 * this.playerNum, y: 50});  
    }

    jump() {
        this.setVelocityY(-17);
    }

    stopJump() {
        if (this.body.velocity.y < -8) {
            this.setVelocityY(this.body.velocity.y / 2);
        }
    }
}

module.exports = {
    Player,
};
