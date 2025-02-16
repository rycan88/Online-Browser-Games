const gameEndedAction = (io, rooms, roomCode) => {
    if (!rooms[roomCode]) { return; }

    const playPile = rooms[roomCode].gameData.playPile;
    const totalPoints = Object.values(playPile).reduce((acc, num) => acc + num, 0);

    const action = {type: "end", points: totalPoints};
    rooms[roomCode].gameData.history.push(action);

    Object.values(rooms[roomCode].playersData).forEach((playerData) => { // Reset isReady to false
        playerData.isReady = false;
    })

    rooms[roomCode].gameData.gameInProgress = false;
    io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);
    io.to(roomCode).emit("game_has_ended", totalPoints);
}

const isMaxPointsReached = (rooms, roomCode) => {
    if (!rooms[roomCode]) { return false; }

    const playPile = rooms[roomCode].gameData.playPile;
    const playersData = rooms[roomCode].playersData;
    const deck = rooms[roomCode].gameData.deck;

    for (const colour of Object.keys(playPile)) {
        const nextNum = playPile[colour] + 1;

        if (deck.cards.some((card) => card.suit === colour && card.number === nextNum)) {
            return false;
        }
        for (playerData of Object.values(playersData)) {
            if (playerData.cards.some((card) => card.suit === colour && card.number === nextNum)) {
                return false;
            }    
        }
    };

    return true;
}

module.exports = {
    gameEndedAction,
    isMaxPointsReached,
};