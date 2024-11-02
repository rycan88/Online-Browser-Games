import Phaser from "phaser";
import { useEffect, useState } from "react";
import { movePlayerManager } from "./Movement";
import getSocket from "../../socket";
import LoadingScreen from "../LoadingScreen";
import { useNavigate } from "react-router-dom";
import { configureKeyboard } from "./Keyboard.js";

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
    };
    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('tiles', `${process.env.PUBLIC_URL}/assets/star-battle/sheet.png`);
      this.load.tilemapTiledJSON("tilemap", `${process.env.PUBLIC_URL}/assets/star-battle/tilemap.json`);
    }

    function create() {      
      const map = this.make.tilemap({key: "tilemap"});
      const tileset = map.addTilesetImage("iceworld", "tiles");
      map.createLayer("Map1", tileset)
      this.cameras.main.scrollY = 30;

      this.add.text(20, 20, "Loading game...");

      this.players = [];

      for (let i = 0; i < 4; i++) {
        const newPlayer = this.physics.add.image(-1000, -1000, "sky");
        newPlayer.setDisplaySize(50, 100);

        this.players.push(newPlayer);
      }

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
