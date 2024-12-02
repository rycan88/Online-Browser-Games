
const windowWidth = 1280;
const windowHeight = 720;

const lineStart = windowWidth / 4;
const lineEnd = windowWidth * 3 / 4;
const lineWidth = lineEnd - lineStart;

const ypos = 35;
const bigTickHeight = 8;
const smallTickHeight = 5;

const divisionCount = 20
const divisionInterval = lineWidth / divisionCount;

let myPlayerToken;
let starToken;

export function createLineMap(scene) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0xBFC0C0, 1);
    graphics.moveTo(lineStart, ypos);
    graphics.lineTo(lineEnd, ypos);
    graphics.strokePath();

    graphics.moveTo(lineStart, ypos + bigTickHeight);
    graphics.lineTo(lineStart, ypos - bigTickHeight);
    graphics.strokePath();

    graphics.moveTo(lineEnd, ypos + bigTickHeight);
    graphics.lineTo(lineEnd, ypos - bigTickHeight);
    graphics.strokePath();

    for (let i = 1; i < divisionCount; i++) {
        graphics.moveTo(lineStart + divisionInterval * i, ypos + smallTickHeight);
        graphics.lineTo(lineStart + divisionInterval * i, ypos - smallTickHeight);
        graphics.strokePath();        
    }

    myPlayerToken = createPlayer(scene);
    starToken = scene.add.image(0, 0, "sky");
    starToken.setDisplaySize(20, 20);
}

const triangleMultiplier = 20;
function createPlayer(scene) {
    const graphics = scene.add.graphics();

    graphics.fillStyle(0xff0000, 1);
    graphics.beginPath();
    graphics.moveTo(0, -2 * triangleMultiplier);
    graphics.lineTo(triangleMultiplier * (3 ** 1/3), triangleMultiplier);
    graphics.lineTo(-triangleMultiplier * (3 ** 1/3), triangleMultiplier);
    graphics.closePath();
    graphics.fillPath();

    graphics.generateTexture("triangle", 20, 20);
    graphics.destroy();


    const triangleSprite = scene.add.sprite(500, 60, "triangle");
    return triangleSprite;
}

export function moveLineMapPlayer(xpos, mapWidth) {
    const linePosition = lineStart + (xpos / mapWidth) * lineWidth;
    myPlayerToken.setPosition(linePosition, ypos + 10);
}

export function moveLineMapStar(xpos, mapWidth) {
    const linePosition = lineStart + (xpos / mapWidth) * lineWidth;
    starToken.setPosition(linePosition, ypos);
}