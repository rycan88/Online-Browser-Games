const { scoreGrid } = require("./crossBattleHelper");

const crossBattleEvents = (io, socket, rooms) => {    
    socket.on("get_all_cross_battle_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit("receive_players_data", rooms[roomCode].playersData);
            socket.emit("receive_should_show_results", rooms[roomCode].gameData.shouldShowResults);
            
            socket.emit("receive_player_data", rooms[roomCode].playersData[socket.userId], rooms[roomCode].gameData.letters);
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });

    socket.on("cross_battle_has_submitted", (roomCode, hasSubmitted) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.shouldShowResults) { return; }
        
        const playersData = rooms[roomCode].playersData;
        const gameData = rooms[roomCode].gameData

        playersData[socket.userId].hasSubmitted = hasSubmitted;

        if (Object.values(playersData).every((data) => data.hasSubmitted === true)) {
            rooms[roomCode].gameData.shouldShowResults = true;

            Object.values(playersData).map((playerData) => {
                Object.assign(playerData, 
                    scoreGrid(playerData.tileToSpace, gameData.letters)
                );
            });            

            io.to(roomCode).emit("receive_players_data", playersData);
            io.to(roomCode).emit("receive_should_show_results", rooms[roomCode].gameData.shouldShowResults);

        }
    });

    socket.on("cross_battle_send_tile_to_space_data", (roomCode, tileToSpace) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.shouldShowResults) { return; }
        
        rooms[roomCode].playersData[socket.userId].tileToSpace = tileToSpace;
    });
}

module.exports = {
    crossBattleEvents,
}
