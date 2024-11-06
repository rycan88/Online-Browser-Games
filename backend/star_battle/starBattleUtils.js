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

const mapPixels = [tileSize[0] * mapDimensions[0], tileSize[1] * mapDimensions[1]]; 
const createStarBattleWorld = (io, socket, rooms, roomCode) => {


    const engine = Engine.create();
    const world = engine.world;
    engine.gravity.scale = 0.002;

    const players = rooms[roomCode].players;
    const playerBodies = [];
    players.forEach((playerNameData, index) => {
        const player = new Player(200 + 200 * index, 50, world, index);
        playerBodies.push(player);
        rooms[roomCode].playersData[playerNameData.userId].player = player;                   
    }) 

    for (let y = 0; y < mapDimensions[1]; y++) {
        for (let x = 0; x < mapDimensions[0]; x++) {
            if (tilemapData[y * mapDimensions[0] + x] === 0) { continue; }
            const location = [(x + 0.5) * tileSize[0], (y + 0.5) * tileSize[1]];
            const block = new Box(location[0], location[1], tileSize[0], tileSize[1], world);

            const leftBlock = new Box(location[0] - mapPixels[0], location[1], tileSize[0], tileSize[1], world);
            const rightBlock = new Box(location[0] + mapPixels[0], location[1], tileSize[0], tileSize[1], world);
        }
    }

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
                } else if (isPlayer(otherBody)) {
                    otherBody.topCollisions.push(characterBody);                   
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

        const playersData = rooms[roomCode].playersData;
        loopPlayerPositions(playersData);
        checkRespawn(playersData);

        const positions = getPositions(playersData);
        io.to(roomCode).emit('receive_player_positions', positions);
    }, frameTime);

    rooms[roomCode].gameData = {engine: engine, world: world, interval: interval};
}

const getPositions = (playersData) => {
     return Object.values(playersData).map((data) => {
        return data.player.body.position;
    })
}

// Makes sure that the player stays on the map
const loopPlayerPositions = (playersData) => {
    Object.values(playersData).forEach((data) => {
        const newPositionX = mod(data.player.body.position.x, mapPixels[0]);
        if (data.player.body.position.x !== newPositionX) {
            data.player.setPositionX(newPositionX);
        }
    })
}

const checkRespawn = (playersData) => {
    Object.values(playersData).forEach((data) => {
        if (data.player.body.position.y >= mapPixels[1] + 150) {
            data.player.respawn();
        }
    })
}

const playerCategory = 0x0002;
const isPlayer = (body) => {
    return body.collisionFilter.category === playerCategory;
}

const mod = (n, m) => {
    if (n < 0) {
        return ((n % m) + m) % m; 
    } 

    return n % m;
}

module.exports = {
    createStarBattleWorld,
}