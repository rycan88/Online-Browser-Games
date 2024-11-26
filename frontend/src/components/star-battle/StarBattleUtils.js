
export function adjustPosition(myData, position, windowWidth, tilemapWidth) {
    if (myData.x + windowWidth / 2 + 500 < position.x) {
        return {x: position.x - tilemapWidth, y: position.y};
    } else if (myData.x - windowWidth / 2 - 500 > position.x) {
        return {x: position.x + tilemapWidth, y: position.y};
    } else {
        return position;
    }
}