const gameEndedAction = (io, rooms, roomCode) => {
    if (!rooms[roomCode]) { return; }

    const playPile = rooms[roomCode].gameData.playPile;
    const totalPoints = Object.values(playPile).reduce((acc, num) => acc + num, 0);

    const action = {type: "end", points: totalPoints};
    rooms[roomCode].gameData.history.push(action);

    rooms[roomCode].gameData.gameInProgress = false;
    io.to(roomCode).emit("game_has_ended", totalPoints);
}

module.exports = {
    gameEndedAction,
};