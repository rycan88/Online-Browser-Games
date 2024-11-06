
export function adjustPosition(myPosition, position, windowWidth, tilemapWidth) {
    if (myPosition.x + windowWidth / 2 + 25 < position.x) {
        return {x: position.x - tilemapWidth, y: position.y};
    } else if (myPosition.x - windowWidth / 2 - 25 > position.x) {
        return {x: position.x + tilemapWidth, y: position.y};
    } else {
        return position;
    }
}