import getSocket from "../../socket";

const socket = getSocket();

export function movePlayerManager(roomCode, cursorKeys, deltaTime) {
    let movement = {};
    if (cursorKeys.left.isDown || cursorKeys.aKey.isDown) {
        movement.left = true;
    }

    if (cursorKeys.right.isDown || cursorKeys.dKey.isDown) {
        movement.right = true;
    } 

    if (cursorKeys.shift.isDown) {
        movement.sprint = true;
    } 

    socket.emit("star_battle_move", roomCode, movement, deltaTime);

    /*
    if (cursorKeys.down.isDown || cursorKeys.sKey.isDown) {
    player.setVelocityY(playerMovementSpeed);
    }
    */
    
}