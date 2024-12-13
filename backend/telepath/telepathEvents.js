const { telepathPlayerData } = require("./telepathPlayerData");
const telepathHelper = require("./telepathHelper");

const telepathEvents = (io, socket, rooms) => {
    if (rooms === null) { return; }
    socket.on("send_telepath_words", (roomCode, chosenWords) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;

            if (playersData[socket.userId].hasPickedWords) { return; }

            playersData[socket.userId].chosenWords = chosenWords; 
        }
    })

    // Triggers when a player is ready to send their wordList
    socket.on("send_telepath_words_ready", (roomCode) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;

            if (playersData[socket.userId].hasPickedWords) { return; }

            playersData[socket.userId].hasPickedWords = true;

            // Show results
            if (!Object.values(playersData).find((data) => data.hasPickedWords === false)) {
                telepathHelper.endRound(io, rooms, roomCode);
            }
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    socket.on("unsend_telepath_words_ready", (roomCode) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;

            if (!playersData[socket.userId].hasPickedWords) { return; }

            playersData[socket.userId].hasPickedWords = false;
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    // Triggers when player is ready for a new word
    socket.on("send_telepath_ready", (roomCode) => {
        if (rooms[roomCode]) {
            let playersData = rooms[roomCode].playersData;

            if (playersData[socket.userId].isReady) { return; }

            playersData[socket.userId].isReady = true;
            
            // Start new round
            if (!Object.values(playersData).find((data) => data.isReady === false)) {
                telepathHelper.startRound(io, rooms, roomCode);
            }      
            io.to(roomCode).emit("receive_players_data", playersData); 
        }
    })
    
    socket.on("telepath_get_my_words", (roomCode) => {
        if (!rooms[roomCode]) { return; }

        socket.emit("receive_my_words", rooms[roomCode].playersData[socket.userId].chosenWords);
    });

    socket.on("get_all_telepath_data", (roomCode) => {
        if (rooms[roomCode]) {
            if (!(socket.userId in rooms[roomCode].playersData)) {
                socket.emit('room_error', `Game ${roomCode} has already started`);
                return;
            }

            socket.emit('receive_game_data', rooms[roomCode].gameData);
            socket.emit('receive_players_data', rooms[roomCode].playersData);
            socket.emit('update_team_mode', rooms[roomCode].teamMode);
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });

    socket.on("get_telepath_settings_data", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        const timeLimit = rooms[roomCode].gameData.timeLimit;

        socket.emit('receive_settings_data', {timeLimit: timeLimit});
        socket.emit('update_team_mode', rooms[roomCode].teamMode);
    });

    socket.on("send_telepath_settings_data", (roomCode, settingsData) => {
        if (!rooms[roomCode] || !settingsData) { return; }
        const timeLimit = settingsData.timeLimit;
        const teamMode = settingsData.teamMode;

        if (timeLimit) {
            rooms[roomCode].gameData.timeLimit = timeLimit; 
            io.to(roomCode).emit('receive_settings_data', {timeLimit: timeLimit});
        }

        if (teamMode != null) {
            rooms[roomCode].teamMode = teamMode; 
            io.to(roomCode).emit('update_team_mode', teamMode);
        }

        io.to(roomCode).emit("receive_game_data", rooms[roomCode].gameData); 
    });
}

module.exports = {
    telepathEvents,
}
