import Phaser from "phaser";
import getSocket from "../../socket";

const socket = getSocket();
export const configureKeyboard = (game, roomCode) => {
    game.cursorKeys = game.input.keyboard.createCursorKeys();
    game.cursorKeys.wKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    game.cursorKeys.aKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    game.cursorKeys.sKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    game.cursorKeys.dKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const spaceKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const upKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    const upKeys = [game.cursorKeys.wKey, spaceKey, upKey];

    upKeys.forEach(key => {
        key.on('down', () => {
            socket.emit("star_battle_jump", roomCode, true);
        });
    
        key.on('up', () => {
            socket.emit("star_battle_jump", roomCode, false);
        });
    });

}