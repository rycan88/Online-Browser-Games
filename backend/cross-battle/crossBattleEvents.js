
const crossBattleEvents = (io, socket, rooms) => {    
    socket.on("get_all_cross_battle_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit("receive_players_data", rooms[roomCode].playersData[socket.userId], rooms[roomCode].gameData.letters);

        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });
}

module.exports = {
    crossBattleEvents,
}
