const { telepathPlayerData } = require("./telepathPlayerData");
const telepathHelper = require("./telepathHelper");

const telepathEvents = (io, socket, rooms) => {
    if (rooms === null) { return; }
    // Triggers when a player is ready to send their wordList
    socket.on("send_telepath_words", (roomCode, chosenWords) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;
            const teamMode = rooms[roomCode].teamMode;
            playersData[socket.userId].chosenWords = chosenWords; 
            playersData[socket.userId].hasPickedWords = true;

            if (!Object.values(playersData).find((data) => data.hasPickedWords === false)) {
                const gameData = rooms[roomCode].gameData;
                gameData.shouldShowResults = true; 
                telepathHelper.calculateScores(playersData, teamMode);
                io.to(roomCode).emit("receive_game_data", gameData);    
            }
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    socket.on("unsend_telepath_words", (roomCode) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;
            playersData[socket.userId].chosenWords = []; 
            playersData[socket.userId].hasPickedWords = false;
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    // Triggers when player is ready for a new word
    socket.on("send_telepath_ready", (roomCode) => {
        if (rooms[roomCode]) {
            let playersData = rooms[roomCode].playersData;
            playersData[socket.userId].isReady = true;

            if (!Object.values(playersData).find((data) => data.isReady === false)) {
                Object.values(playersData).forEach((userData) => {
                    playersData[userData.nameData.userId] = telepathPlayerData(userData.nameData, userData.partner, userData.totalScore);
                })
                const gameData = rooms[roomCode].gameData;
                gameData.shouldShowResults = false;
                telepathHelper.setNewPrompt(gameData);
                io.to(roomCode).emit("receive_game_data", gameData);    
            }      
            io.to(roomCode).emit("receive_players_data", playersData); 
        }
    })
    
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
}

module.exports = {
    telepathEvents,
}
