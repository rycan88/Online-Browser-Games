import Phaser from "phaser";
import { useEffect, useState } from "react";
import { movePlayerManager } from "./Movement";
import getSocket from "../../socket";
import LoadingScreen from "../LoadingScreen";
import { useNavigate } from "react-router-dom";
import { configureKeyboard } from "./Keyboard.js";
import { adjustPosition } from "./StarBattleUtils.js";
import OverlayScene from "./StarBattleOverlay.js";

// TODO: 

// Number line (Dec. 1st)

// Show everyones star count (Dec. 3)
// Wall jump
// Coyote time
// Player can steal stars (ground pound works on other players) (Dec. 3) 

// Add Powerups (Mini, Fire Power) (Dec. 5-9)
// Add Enemies

const socket = getSocket();

const windowWidth = 1280;
const windowHeight = 720;
export const StarBattle = ({roomCode}) => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('room_error', (errorMessage) => {
      navigate(`/star_battle/lobby`, { state: {error: errorMessage}});
    });

    socket.emit('join_room', roomCode);

    return () => {
      socket.off("room_error");
    };
  })

  useEffect(() => {


    const config = {
      type: Phaser.AUTO,
      width: windowWidth,
      height: windowHeight,
      backgroundColor: 0x000000, //0x87CEFA,
      physics: {
        default: "arcade",
        arcade: {},
      },
      parent: "phaser-container",
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      fps: {
        target: 100,
        forceSetTimeout: true
      }
    };

    const game = new Phaser.Game({
      ...config,
      scene: [config.scene, OverlayScene],
    });

    function preload() {
      this.load.image('tiles', `${process.env.PUBLIC_URL}/assets/star-battle/sheet.png`);
      this.load.tilemapTiledJSON("tilemap", `${process.env.PUBLIC_URL}/assets/star-battle/tilemap.json`);
    }

    function create() {      
      let myIndex = -1;
      let previousTime = Date.now();
      let totalFrames = 0;
      let minFPS = 1000;

      const leftMap = this.make.tilemap({key: "tilemap"});
      const rightMap = this.make.tilemap({key: "tilemap"});
      const anotherMap = this.make.tilemap({key: "tilemap"});

      const tilemapWidth = 50 * 40;
      const tilemapHeight = 50 * 15;
      const tileset = leftMap.addTilesetImage("iceworld", "tiles");
      leftMap.createLayer("Map1", tileset, -tilemapWidth, 0);
      rightMap.createLayer("Map1", tileset, 0, 0);
      anotherMap.createLayer("Map1", tileset, tilemapWidth, 0);

      this.players = [];
      for (let i = 0; i < 4; i++) {
        const newPlayer = this.physics.add.image(-1000, -1000, "sky");
        newPlayer.setDisplaySize(50, 50);

        this.players.push(newPlayer);
      }

      this.cameras.main.setBounds(-tilemapWidth, tilemapHeight - windowHeight, tilemapWidth * 3, windowHeight);

      const star = this.physics.add.image(-1000, -1000, "sky");
      star.setDisplaySize(100, 100);

      configureKeyboard(this, roomCode);

      socket.on("receive_self_index", (selfIndex) => {
        myIndex = selfIndex;
        this.cameras.main.startFollow(this.players[selfIndex]);
      });

      socket.on("receive_positions", (playerPositions, starPosition) => {
        if (!playerPositions || myIndex === -1) { return; }


        const myData = playerPositions[myIndex];
        const overlayScene = game.scene.keys["OverlayScene"];
        overlayScene.events.emit("starCount", myData.starsCollected);
        overlayScene.events.emit("myPosition", myData.x, tilemapWidth);
        overlayScene.events.emit("starPosition", starPosition.x, tilemapWidth);

        totalFrames += 1;
        const currentTime = Date.now();
        const timeDiff = currentTime - previousTime;
        minFPS = Math.min(minFPS, Math.floor((1 / timeDiff) * 1000));
        previousTime = currentTime;
        if (totalFrames > 40) {
          overlayScene.events.emit("fps", minFPS);
          totalFrames = 0;
          minFPS = 1000;
        }

        playerPositions.forEach((position, index) => {
          const newPosition = adjustPosition(myData, position, windowWidth, tilemapWidth);
          this.players[index].setPosition(newPosition.x, newPosition.y)
        })

        if (starPosition) {
          const newPosition = adjustPosition(myData, starPosition, windowWidth, tilemapWidth);
          star.setPosition(newPosition.x, newPosition.y);
        }

      });

      socket.emit("star_battle_get_self_index", roomCode);
      
      this.scene.launch("OverlayScene")
    }

    function update(time, delta) {
      movePlayerManager(roomCode, this.cursorKeys, delta / 1000);
    }



    return () => {
      game.destroy(true);
      socket.off("receive_positions");
      socket.off("receive_self_index");
      socket.off("receive_game_data");
      socket.off("receive_star_position");
    };
  }, []);




  return (
    <div className="entirePage flex items-center justify-center bg-[#5072A7]">
      <div id="phaser-container"></div>
    </div>
  );
};

