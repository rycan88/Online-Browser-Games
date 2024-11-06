const Matter = require("matter-js");

const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const windowSize = [1280, 720];
const tileSize = [50, 50];
const characterSize = [50, 100]

const isOnGround = (player) => {
    return player.body.topCollisions.length !== 0;
}

const maxMovementSpeed = 500;
const maxSprintSpeed = maxMovementSpeed * 1.5;

const movementSpeed = 200;
const jumpSpeed = 800;

const accelerationX = 400; 

const applyMovement = (player, movement, deltaTime) => {
    const sprintMultiplier = movement.sprint ? 1.5 : 1;
    const turnSpeed = 150 * sprintMultiplier;
    const moveAcceleration = accelerationX * sprintMultiplier * deltaTime
    // Left
    if (movement.left) {
        player.setVelocityX(-maxMovementSpeed * sprintMultiplier * deltaTime);    
    } 
    
    // Right
    if (movement.right) {
        player.setVelocityX(maxMovementSpeed * sprintMultiplier * deltaTime);   
    } 
    
    // Stop
    if (!movement.left && !movement.right) {
        player.setVelocityX(0); 
    }
}

const starBattleEvents = (io, socket, rooms) => {    
    socket.on("star_battle_get_self_index", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        const selfIndex = Object.keys(rooms[roomCode].playersData).indexOf(socket.userId);
        socket.emit("receive_self_index", selfIndex);
    });


    socket.on("star_battle_move", (roomCode, movement, deltaTime) => {
        if (!rooms[roomCode]) { return; }
        
        const myPlayerData = rooms[roomCode].playersData[socket.userId];
        
        if (!myPlayerData) { return; }

        const player = myPlayerData.player;
        applyMovement(player, movement, deltaTime);
    });

    // jumpStatus true if jump, false if should stop jumping
    socket.on("star_battle_jump", (roomCode, jumpStatus) => {
        if (!rooms[roomCode]) { return; }
        
        const myPlayerData = rooms[roomCode].playersData[socket.userId];
        if (!myPlayerData) { return; }

        const player = myPlayerData.player;

        // Jump
        if (isOnGround(player) && jumpStatus) {
            player.jump();
        } else if (!jumpStatus){
            player.stopJump();
        }
    });
}

module.exports = {
    starBattleEvents,
}