const Matter = require("matter-js");
const Engine = Matter.Engine;
const Events = Matter.Events;
const World = Matter.World;
const Bodies = Matter.Bodies;

const tilemapJSON = require("../../frontend/public/assets/star-battle/tilemap.json");
const { Box } = require("./Box");
const { Player } = require("./Player");
const tilemapData = tilemapJSON.layers[0].data;
const tileSize = [tilemapJSON.tilewidth, tilemapJSON.tileheight];
const mapDimensions = [tilemapJSON.layers[0].width, tilemapJSON.layers[0].height]; 

const createStarBattleWorld = (io, socket, rooms, roomCode) => {


    const engine = Engine.create();
    const world = engine.world;
    engine.gravity.scale = 0.002;

    const players = rooms[roomCode].players;
    const playerBodies = [];
    players.forEach((playerNameData, index) => {
        const player = new Player(200 + 200 * index, 50, world);
        playerBodies.push(player);
        rooms[roomCode].playersData[playerNameData.userId].player = player;                   
    }) 

    for (let y = 0; y < mapDimensions[1]; y++) {
        for (let x = 0; x < mapDimensions[0]; x++) {
            if (tilemapData[y * mapDimensions[0] + x] === 0) { continue; }
            const location = [(x + 0.5) * tileSize[0], (y + 0.5) * tileSize[1]];
            const block = new Box(location[0], location[1], tileSize[0], tileSize[1], world);
        }
    }

    //const ground = new Box(600, 100, 2000, 50, world);

    Events.on(engine, "collisionStart", (event) => {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB, collision } = pair;
            const characterBody = isPlayer(bodyA) ? bodyA : isPlayer(bodyB) ? bodyB : null;
            const otherBody = characterBody === bodyA ? bodyB : bodyA;
        
            if (characterBody && otherBody) {
                const normal = collision.normal;
                const isOnTop = normal.y < -0.5; // Adjust threshold as needed (typically -1 for direct upward)
            
                if (isOnTop) {
                    characterBody.topCollisions.push(otherBody);
                }
            }
        });
    });
    
    Events.on(engine, "collisionEnd", (event) => {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            if (isPlayer(bodyA)) {
                bodyA.topCollisions = bodyA.topCollisions.filter(otherBody => otherBody !== bodyB);
            } 

            if (isPlayer(bodyB)) {
                bodyB.topCollisions = bodyB.topCollisions.filter(otherBody => otherBody !== bodyA);
            } 
        });
    });

    const frameTime = 1000 / 80; // 80FPS
    const interval = setInterval(() => {
        Engine.update(engine, frameTime);
        if (!rooms[roomCode]) {
            clearInterval(interval);
            return;
        }
        const positions = getPositions(rooms[roomCode].playersData);
        io.to(roomCode).emit('receive_player_positions', positions);
    }, frameTime);

    rooms[roomCode].gameData = {engine: engine, world: world, interval: interval};
}

const getPositions = (playersData) => {
     return Object.values(playersData).map((data) => {
        return data.player.body.position;
    })
}

const playerCategory = 0x0002;
const isPlayer = (body) => {
    return body.collisionFilter.category === playerCategory;
}

module.exports = {
    createStarBattleWorld,
}