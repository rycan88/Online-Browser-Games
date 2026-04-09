const { saveScore, getTopScores, getPlayerResults } = require("../routes/crossBattleLeaderboardRoutes");
const { updateRoomHost } = require("../serverUtils");
const { isValidWord, getLongestWords } = require("../utils/dictionaryUtils");
const { scoreGrid, crossBattleConfigureGameData, crossBattleConfigurePlayersData, crossBattleSetTimer, crossBattleEndRound, getStartingTileToSpace, submitToDatabase, getDailyLetters } = require("./crossBattleHelper");

const crossBattleEvents = (io, socket, rooms) => {    
    socket.on("get_all_cross_battle_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit("receive_players_data", rooms[roomCode].playersData);
            socket.emit("receive_should_show_results", rooms[roomCode].gameData.shouldShowResults);
            if (rooms[roomCode].gameData.shouldShowResults && rooms[roomCode].gameData.longestWordsData != null) {
                socket.emit("receive_longest_words_data", rooms[roomCode].gameData.longestWordsData);
            }

            socket.emit("receive_letters", rooms[roomCode].gameData.letters);
            socket.emit("receive_timer_data", {roundStartTime: rooms[roomCode].gameData.roundStartTime, 
                                               roundEndTime: rooms[roomCode].gameData.roundEndTime,
                                               timeLimit: rooms[roomCode].gameData.timeLimit,
                                               shouldShowResults: rooms[roomCode].gameData.shouldShowResults,
                                              });
            socket.emit("receive_is_seeded", rooms[roomCode].gameData.isSeeded);
            socket.emit("receive_player_data", rooms[roomCode].playersData[socket.userId]);
        } else {
            const error = (roomCode && roomCode.length <= 4) ? `Lobby ${roomCode} does not exist` : "";
            socket.emit('room_error', error);
        }
    });

    socket.on("cross_battle_has_submitted", (roomCode, hasSubmitted) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.shouldShowResults) { return; }
        
        const playersData = rooms[roomCode].playersData;
        const gameData = rooms[roomCode].gameData

        playersData[socket.userId].hasSubmitted = hasSubmitted;

        io.to(roomCode).emit("receive_players_data", playersData);

        if (Object.values(playersData).every((data) => data.hasSubmitted === true)) {
            crossBattleEndRound(io, rooms, roomCode);
            io.to(roomCode).emit("receive_all_data");
        }
    });

    socket.on("cross_battle_send_tile_to_space_data", (roomCode, tileToSpace) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.shouldShowResults) { return; }
        
        rooms[roomCode].playersData[socket.userId].tileToSpace = tileToSpace;

        if (rooms[roomCode].playersData[socket.userId].hasSubmitted) {
            rooms[roomCode].playersData[socket.userId].hasSubmitted = false;
            socket.emit("receive_player_data", rooms[roomCode].playersData[socket.userId]);
            io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);
        }
    });

    socket.on("cross_battle_is_ready", (roomCode, isReady) => {
        if (!rooms[roomCode]) { return; }

        const playersData = rooms[roomCode].playersData;
        playersData[socket.userId].isReady = isReady;

        if (Object.values(playersData).every((data) => data.isReady === true)) {
            crossBattleConfigurePlayersData(rooms, roomCode);
            crossBattleConfigureGameData(io, rooms, roomCode);

            io.to(roomCode).emit("start_new_round");
        }

        io.to(roomCode).emit("receive_players_data", playersData);
    });

    socket.on("get_cross_battle_settings_data", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        socket.emit("receive_settings_data", 
            {timeLimit: rooms[roomCode].gameData.timeLimit,
             nextSeed: rooms[roomCode].gameData.nextSeed,
            }
        );

        updateRoomHost(rooms, roomCode);
        io.to(roomCode).emit("receive_room_host_id", rooms[roomCode].roomHostId);
    });

     socket.on("set_cross_battle_settings_data", (roomCode, data) => {
        if (!rooms[roomCode] || !data) { return; }
        
        rooms[roomCode].gameData.timeLimit = data.timeLimit;
        rooms[roomCode].gameData.nextSeed = data.nextSeed;
        io.to(roomCode).emit("receive_settings_data",             
            {timeLimit: rooms[roomCode].gameData.timeLimit,
             nextSeed: rooms[roomCode].gameData.nextSeed,
            }
        );
    });

    socket.on("check_cross_battle_word", (roomCode, word) => {
        if (!rooms[roomCode] || !word) { return; }
        
        const isValid = isValidWord(word);
        socket.emit("receive_is_word_valid", isValid);              
    
    });

    socket.on("cross_battle_return_tiles_to_rack", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        rooms[roomCode].playersData[socket.userId].tileToSpace = getStartingTileToSpace(rooms[roomCode].gameData.letters.length);
        socket.emit("receive_all_data");
    });

    socket.on("cross_battle_submit_to_database", (roomCode) => {
        //submitToDatabase(rooms, roomCode, socket.userId, socket.nickname);
    });

    socket.on("get_cross_battle_leaderboard", async (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        try {
            const leaderboard = await getTopScores();
            socket.emit("receive_leaderboard", leaderboard);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        }
    });

    socket.on("cross_battle_get_my_results", async (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        try {
            const myResults = await getPlayerResults(socket.userId);
            socket.emit("receive_my_results", myResults);
        } catch (err) {
            console.error("Error fetching results:", err);
        }
    })

    socket.on("cross_battle_get_player_results", async (roomCode, userId) => {
        if (!rooms[roomCode]) { return; }
        
        try {
            const playerResults = await getPlayerResults(userId);
            socket.emit("receive_player_results", playerResults);
        } catch (err) {
            console.error("Error fetching results:", err);
        }
    })

    socket.on("cross_battle_get_daily_longest_words", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        const letters = getDailyLetters(22);
        const longestWords = getLongestWords(letters);

        socket.emit("receive_daily_longest_words", longestWords);
    })

    socket.on("has_cross_battle_daily_been_played", async (roomCode) => {
        try {
            const myResults = await getPlayerResults(socket.userId);
            socket.emit("has_played_daily", myResults !== null);
        } catch (err) {
            console.error("Error fetching results:", err);
        }
    });
}




module.exports = {
    crossBattleEvents,
}
