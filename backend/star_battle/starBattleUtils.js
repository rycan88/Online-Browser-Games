const planck = require("planck-js");

const tilemapJSON = require("../../frontend/public/assets/star-battle/tilemap.json");
const { Box } = require("./Box");
const { Player } = require("./Player");
const { Star } = require("./Star");
const tilemapData = tilemapJSON.layers.find(layer => layer.name === 'Map1').data;
const tileSize = [tilemapJSON.tilewidth, tilemapJSON.tileheight];
const mapDimensions = [tilemapJSON.layers[0].width, tilemapJSON.layers[0].height]; 

const starSpawnLayer = tilemapJSON.layers.find(layer => layer.name === 'StarSpawn');
const starSpawnPoints = starSpawnLayer.objects;

const mapPixels = [tileSize[0] * mapDimensions[0], tileSize[1] * mapDimensions[1]]; 
const SCALE = 1 / 50 // 1 meter = 50px 
const scaledMapPixels = [mapPixels[0] * SCALE, mapPixels[1] * SCALE];

const createStarBattleWorld = (io, socket, rooms, roomCode) => {
    let currentFrame = 0;

    const world = planck.World({gravity: planck.Vec2(0, 30)});

    const players = rooms[roomCode].players;

    players.forEach((playerNameData, index) => {
        const player = new Player(200 * index, 50, mapDimensions, world, index);
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

    const star = new Star(0, 0, world);
    setRandomStarPosition(star.body);

    world.on('pre-solve', () => {
        Star.neutralizeGravity(world);
    });

    world.on('begin-contact', (contact) => {

        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();

        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        beginGroundCollision(fixtureA, fixtureB, bodyA, bodyB);
        beginStarCollision(fixtureA, fixtureB, bodyA, bodyB);


    });
        
    world.on('end-contact', (contact) => {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();

        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        endGroundCollision(fixtureA, fixtureB, bodyA, bodyB);

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


        // Updates star position if grabbed
        let starPosition = star.getPosition();
        if (star.body.nextPosition) {
            star.setPosition(star.body.nextPosition.x, star.body.nextPosition.y);
            starPosition = star.body.nextPosition;
            star.body.nextPosition = null;
        }

        const compactedData = getData(playersData);
        io.to(roomCode).emit('receive_positions', compactedData, {x: starPosition.x / SCALE, y: starPosition.y / SCALE});
    }, 1000 / fps);

    rooms[roomCode].gameData = {world: world, interval: interval};
}

const getData = (playersData) => {
     return Object.values(playersData).map((data) => {
        const position = data.player.getPosition();
        const starsCollected = data.player.body.starsCollected;
        return {x: position.x / SCALE, y: position.y / SCALE, starsCollected: starsCollected};
    })
}


const isPlayerGroundSensor = (fixture) => {
    return fixture.getUserData() === "playerGroundSensor";
}

const isPlayerBodySensor = (fixture) => {
    return fixture.getUserData() === "playerBodySensor";
}

const isStar = (body) => {
    return body.getUserData() === "star";
}

const setRandomStarPosition = (starBody) => {
    const oldStarPosition = starBody.getPosition();

    let starPosition = starSpawnPoints[Math.floor(Math.random() * starSpawnPoints.length)];
    let newPosition = planck.Vec2(starPosition.x * SCALE, starPosition.y * SCALE);

    while (Math.abs(newPosition.x - oldStarPosition.x) + Math.abs(newPosition.y - oldStarPosition.y) < 400 * SCALE) {
        starPosition = starSpawnPoints[Math.floor(Math.random() * starSpawnPoints.length)];
        newPosition = planck.Vec2(starPosition.x * SCALE, starPosition.y * SCALE);
    }

    starBody.nextPosition = newPosition; 
}

// Collision

const beginGroundCollision = (fixtureA, fixtureB, bodyA, bodyB) => {
    const characterBody = isPlayerGroundSensor(fixtureA) ? bodyA : isPlayerGroundSensor(fixtureB) ? bodyB : null;
    const otherBody = characterBody === bodyA ? bodyB : bodyA;

    if (characterBody && otherBody) {
        characterBody.topCollisions.push(otherBody);
    }
}

const endGroundCollision = (fixtureA, fixtureB, bodyA, bodyB) => {
    const characterBody = isPlayerGroundSensor(fixtureA) ? bodyA : isPlayerGroundSensor(fixtureB) ? bodyB : null;
    const otherBody = characterBody === bodyA ? bodyB : bodyA;

    if (characterBody && otherBody) {
        characterBody.topCollisions = characterBody.topCollisions.filter(body => body !== otherBody);
    }
}

const beginStarCollision = (fixtureA, fixtureB, bodyA, bodyB) => {
    const starBody = isStar(bodyA) ? bodyA : isStar(bodyB) ? bodyB : null;
    const otherFixture = starBody === bodyA ? fixtureB : fixtureA;
    const otherBody = otherFixture.getBody();

    if (starBody && isPlayerBodySensor(otherFixture) && !starBody.nextPosition) {
        setRandomStarPosition(starBody);
        otherBody.starsCollected += 1;
    }
}

module.exports = {
    createStarBattleWorld,
}