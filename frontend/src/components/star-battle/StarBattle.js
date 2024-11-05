import Phaser from "phaser";
import { useEffect, useState } from "react";
import { movePlayerManager } from "./Movement";
import getSocket from "../../socket";
import LoadingScreen from "../LoadingScreen";
import { useNavigate } from "react-router-dom";
import { configureKeyboard } from "./Keyboard.js";

// TODO: 

// Respawn on death
// Ground Pound
// Fix keyboard ghosting
// Correct Map Loop (properly)
// Better Horizontal Movement
// Crouch
// Stars spawn in starSpawnPoints
// Player can collect stars
// Player can steal stars (ground pound works on other players)
// Add Powerups (Mini, Fire Power)
// Add Enemies

const socket = getSocket();

const windowWidth = 1280;
const windowHeight = 720;
export const StarBattle = ({roomCode}) => {
  const [selfIndex, setSelfIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("receive_self_index", (selfIndex) => {
      setSelfIndex(selfIndex);
    });

    socket.on('room_error', (errorMessage) => {
      navigate(`/star_battle/lobby`, { state: {error: errorMessage}});
    });

    socket.emit('join_room', roomCode);

    return () => {
      socket.off("receive_self_index");
      socket.off("room_error");
    };
  })

  useEffect(() => {
    socket.emit("get_self_index");

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
        target: 80,
        forceSetTimeout: true
      }
    };
    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('tiles', `${process.env.PUBLIC_URL}/assets/star-battle/sheet.png`);
      this.load.tilemapTiledJSON("tilemap", `${process.env.PUBLIC_URL}/assets/star-battle/tilemap.json`);
    }

    function create() {      
      const leftMap = this.make.tilemap({key: "tilemap"});
      const rightMap = this.make.tilemap({key: "tilemap"});
      const anotherMap = this.make.tilemap({key: "tilemap"});

      const tilemapWidth = 50 * 26;
      const tilemapHeight = 50 * 15;
      const tileset = leftMap.addTilesetImage("iceworld", "tiles");
      leftMap.createLayer("Map1", tileset, -tilemapWidth, 0);
      rightMap.createLayer("Map1", tileset, 0, 0);
      anotherMap.createLayer("Map1", tileset, tilemapWidth, 0);
      //this.cameras.main.scrollY = 30;

      const loadingText = this.add.text(20, 20, "Loading game...");
      loadingText.setScrollFactor(0);

      this.players = [];

      for (let i = 0; i < 4; i++) {
        const newPlayer = this.physics.add.image(-1000, -1000, "sky");
        newPlayer.setDisplaySize(50, 100);

        this.players.push(newPlayer);
      }

      this.cameras.main.startFollow(this.players[0]);
      this.cameras.main.setBounds(-tilemapWidth, tilemapHeight - windowHeight, tilemapWidth * 3, windowHeight);

      configureKeyboard(this, roomCode);

      socket.on("receive_player_positions", (positions) => {
        if (!positions) { return; }
        positions.forEach((position, index) => {
          this.players[index].setPosition(position.x, position.y)
        })
      });
    }

    function update(time, delta) {
      movePlayerManager(roomCode, this.cursorKeys, delta / 1000);
    }

    return () => {
      game.destroy(true);
      socket.off("receive_player_positions");
      socket.off("receive_self_index");
      socket.off("receive_game_data");
    };
  }, []);




  return (
    <div className="entirePage flex items-center justify-center bg-[#5072A7]">
      <div id="phaser-container"></div>
    </div>
  );
  

};
