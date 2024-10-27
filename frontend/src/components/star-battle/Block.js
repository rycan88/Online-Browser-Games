import Phaser from "phaser";

export class Block extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, "sky");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDisplaySize(50, 50);
        this.setOrigin(0, 0);
    }
}