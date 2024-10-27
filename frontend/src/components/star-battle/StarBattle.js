import Phaser from "phaser";
import { useEffect } from "react";
import { movePlayerManager } from "./Movement";
import { Block } from "./Block";

export const StarBattle = () => {
  const windowWidth = 1280;
  const windowHeight = 720;
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: windowWidth,
      height: windowHeight,
      backgroundColor: 0x000000, //0x87CEFA,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 600 },
        },
      },
      parent: "phaser-container",
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };
    const game = new Phaser.Game(config);
    function preload() {
      //this.load.setBaseURL('https://labs.phaser.io');
      //this.load.image('sky', 'assets/skies/space3.png');
    }

    function create() {
      this.add.text(20, 20, "Loading game...");
      this.player = this.physics.add.image(400, 300, "sky");
      this.player.setDisplaySize(50, 80);
      this.player.setCollideWorldBounds(true);

      // Blocks
      this.blocks = this.physics.add.group();
      this.blocks.add(new Block(this, 900, 570));
      this.blocks.add(new Block(this, 700, 470));

      this.blocks.children.iterate((block) => {
        block.setImmovable(true);
        block.body.setAllowGravity(false); // Disable gravity for the blocks
      });

      this.physics.add.collider(this.player, this.blocks);

      this.cursorKeys = this.input.keyboard.createCursorKeys();
      this.cursorKeys.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.cursorKeys.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.cursorKeys.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.cursorKeys.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    function moveObject(obj, speedArr) {
      obj.x = (obj.x + speedArr[0] + windowWidth) % windowWidth;
      obj.y = (obj.y + speedArr[1] + windowHeight) % windowHeight;
    }

    function update(time, delta) {
      movePlayerManager(this.cursorKeys, this.player, delta / 1000);
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="entirePage flex items-center justify-center bg-[#5072A7]">
      <div id="phaser-container"></div>
    </div>
  );
};
