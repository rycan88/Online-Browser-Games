import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const getPlayerCoord = (playerCount, index, selfIndex) => {
    if (playerCount === 0) { return; }


    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - NAVBAR_HEIGHT;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const width = viewportWidth * 0.70;
    const height = viewportHeight * 0.70;

    const coords = getPlayerCoords(playerCount, width, height, centerX, centerY);
    const adjustedIndex = selfIndex >= 0 ? (index + playerCount - selfIndex) % playerCount : index;

    return {left: coords[adjustedIndex][0], top: coords[adjustedIndex][1]}
}

export const getLastElementPosition = (name) => {
    const element = document.querySelector(name);
    const rect = element.lastElementChild.getBoundingClientRect();
    return {left: rect.left, top: rect.top}
}