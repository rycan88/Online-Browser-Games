import Phaser from "phaser";
import { createLineMap, moveLineMapPlayer, moveLineMapStar } from "./LineMap";



class OverlayScene extends Phaser.Scene {
    constructor() {
        super({key: "OverlayScene"});
    }

    preload() {

    }

    create() {
        createLineMap(this);
        const starCountText = this.add.text(30, 30, "Stars: ");
        this.fpsText = this.add.text(1100, 30, ``);

        this.events.on("starCount", (starsCollected) => {
            starCountText.setText(`Stars: ${starsCollected}`);
        });

        this.events.on("myPosition", (xpos, mapWidth) => {
            moveLineMapPlayer(xpos, mapWidth);
        });

        this.events.on("starPosition", (xpos, mapWidth) => {
            moveLineMapStar(xpos, mapWidth);
        });
    }

    update() {
        this.fpsText.setText(`FPS: ${Math.floor(this.sys.game.loop.actualFps)}`)
    }
}

export default OverlayScene;