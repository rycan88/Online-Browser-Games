const planck = require("planck-js");

const tilemapJSON = require("../../frontend/public/assets/star-battle/tilemap.json");
const { Box } = require("./Box");
const { Player } = require("./Player");
const tilemapData = tilemapJSON.layers[0].data;
const tileSize = [tilemapJSON.tilewidth, tilemapJSON.tileheight];
const mapDimensions = [tilemapJSON.layers[0].width, tilemapJSON.layers[0].height]; 

const mapPixels = [tileSize[0] * mapDimensions[0], tileSize[1] * mapDimensions[1]]; 
const SCALE = 1 / 50 // 1 meter = 50px 
const scaledMapPixels = [mapPixels[0] * SCALE, mapPixels[1] * SCALE];

const createStarBattleWorld = (io, socket, rooms, roomCode) => {
    let currentFrame = 0;

    const world = planck.World({gravity: planck.Vec2(0, 30)});

    const players = rooms[roomCode].players;
    const playerBodies = [];
    players.forEach((playerNameData, index) => {
        const player = new Player(200 * index, 50, world, index);
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

    world.on('begin-contact', (contact) => {

        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();

        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        const characterBody = isPlayerFoot(fixtureA) ? bodyA : isPlayerFoot(fixtureB) ? bodyB : null;
        const otherBody = characterBody === bodyA ? bodyB : bodyA;

        if (characterBody && otherBody) {
            characterBody.topCollisions.push(otherBody);
        }
    });
        
    world.on('end-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();

        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        const characterBody = isPlayerFoot(fixtureA) ? bodyA : isPlayerFoot(fixtureB) ? bodyB : null;
        const otherBody = characterBody === bodyA ? bodyB : bodyA;

        if (characterBody && otherBody) {
            characterBody.topCollisions = characterBody.topCollisions.filter(body => body !== otherBody);
        }
    });    

    const fps = 80; // 80FPS

    const interval = setInterval(() => {
        world.step(1 / fps);
        if (!rooms[roomCode]) {
            clearInterval(interval);
            return;
        }

        currentFrame += 1;
        
        const playersData = rooms[roomCode].playersData;

        Object.values(playersData).forEach((data) => {
            data.player.currentFrame = currentFrame;
            data.player.update(scaledMapPixels);
        });      

        const positions = getPositions(playersData);

        io.to(roomCode).emit('receive_player_positions', positions);
    }, 1000 / fps);

    rooms[roomCode].gameData = {world: world, interval: interval};
}

const getPositions = (playersData) => {
     return Object.values(playersData).map((data) => {
        const position = data.player.getPosition();
        return {x: position.x / SCALE, y: position.y / SCALE};
    })
}

const playerCategory = 0x0002;
const isPlayerFoot = (fixture) => {
    return fixture.getUserData() === "playerFoot";
}

module.exports = {
    createStarBattleWorld,
}