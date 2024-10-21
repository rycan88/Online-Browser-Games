const { rpsMeleePlayerData } = require("./rpsMeleePlayerData");

const rpsMeleeEvents = (io, socket, rooms) => {    
    socket.on("get_all_rps_melee_data", (roomCode) => {
        if (!rooms[roomCode]) { return; }

        socket.emit('receive_game_data', rooms[roomCode].gameData);
        socket.emit('receive_players_data', rooms[roomCode].playersData);
    });

    socket.on("get_rps_melee_settings_data", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        const roundDuration = rooms[roomCode].gameData.roundDuration;
        const maxPoints = rooms[roomCode].gameData.maxPoints;
        socket.emit('receive_settings_data', {roundDuration: roundDuration, maxPoints: maxPoints});
    });

    socket.on("send_rps_melee_settings_data", (roomCode, settingsData) => {
        console.log("settingsData", settingsData);
        if (!rooms[roomCode] || !settingsData) { return; }
        const roundDuration = settingsData.roundDuration;
        const maxPoints = settingsData.maxPoints;
        
        if (roundDuration) {
            rooms[roomCode].gameData.roundDuration = roundDuration; 
        }

        if (maxPoints) {
            rooms[roomCode].gameData.maxPoints = maxPoints; 
        }

        io.to(roomCode).emit('receive_settings_data', {roundDuration: roundDuration, maxPoints: maxPoints});
    });

    socket.on("rps_melee_ready", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        const myData = rooms[roomCode].playersData[socket.userId];
        myData.isReady = true;

        if (rooms[roomCode].playersData[myData.opponent.userId].isReady) {
            rooms[roomCode].gameData.gameInProgress = true;
            io.to(roomCode).emit('receive_game_data', rooms[roomCode].gameData);
            io.to(roomCode).emit('start_count_down');

            const playersData = rooms[roomCode].playersData;
            for (const player of Object.keys(playersData)) {
                const opponent = playersData[player].opponent;
                const myNameData = playersData[player].nameData;

                playersData[player] = rpsMeleePlayerData(myNameData, opponent, 0);           
            }

            setTimeout(() => {
                startRound(io, socket, rooms, roomCode);
            }, 3000)
        }
        io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
    });

    socket.on("rps_melee_choose", (roomCode, choice) => {
        if (!rooms[roomCode]) { return; }
        const playersData = rooms[roomCode].playersData;
        if (playersData[socket.userId].choice || !rooms[roomCode].gameData.roundInProgress) { return; }

        playersData[socket.userId].choice = choice;
        
        io.to(roomCode).emit('receive_players_data', playersData);
    });
}

const startRound = (io, socket, rooms, roomCode) => {
    const maxPoints = rooms[roomCode].gameData.maxPoints;
    
    const playersData = rooms[roomCode].playersData;
    for (const player of Object.keys(playersData)) {
        const opponent = playersData[player].opponent;
        const myNameData = playersData[player].nameData;
        const score = playersData[player].score;
        const choiceHistory = playersData[player].choiceHistory;

        playersData[player] = rpsMeleePlayerData(myNameData, opponent, score, choiceHistory);
    }

    io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);

    for (const player of Object.keys(playersData)) {
        if (playersData[player].score >= maxPoints) {
            rooms[roomCode].gameData.gameInProgress = false;
            io.to(roomCode).emit('receive_game_data', rooms[roomCode].gameData);
            return;
        }
    }

    const roundDuration = rooms[roomCode].gameData.roundDuration;
    const restInterval = rooms[roomCode].gameData.restInterval;

    rooms[roomCode].gameData.roundInProgress = true;

    io.to(roomCode).emit("round_started", Date.now());
    io.to(roomCode).emit('receive_game_data', rooms[roomCode].gameData);

    setTimeout(() => {
        calculateScore(io, socket, rooms, roomCode);
        
        rooms[roomCode].gameData.roundInProgress = false;
        io.to(roomCode).emit("round_ended");
        io.to(roomCode).emit('receive_game_data', rooms[roomCode].gameData);


        setTimeout(() => {
            startRound(io, socket, rooms, roomCode);
        }, restInterval)

    }, roundDuration)
}

const losingMatchups = {"rock": "scissors", "paper": "rock", "scissors": "paper"}; // Outputs the choice that would lose to the input
const calculateScore = (io, socket, rooms, roomCode) => {
    const playersData = rooms[roomCode].playersData;

    const dataValues = Object.keys(playersData);
    const p1Data = playersData[dataValues[0]];
    const p2Data = playersData[dataValues[1]];

    const p1Choice = p1Data.choice;
    const p2Choice = p2Data.choice;
    if (p1Choice === p2Choice) { 

    } else if (!p1Choice || losingMatchups[p2Choice] === p1Choice) {
        p2Data.didWin = true;
        p1Data.didWin = false;
        p2Data.score += 1;
    } else if (!p2Choice || losingMatchups[p1Choice] === p2Choice) {
        p1Data.didWin = true;
        p2Data.didWin = false;
        p1Data.score += 1;
    } else {
        console.log("ERROR: Choice should not be possible", p1Choice, p2Choice);
        return;
    }

    p1Data.choiceHistory.push({myChoice: p1Choice, didWin: p1Data.didWin, opChoice: p2Choice})
    p2Data.choiceHistory.push({myChoice: p2Choice, didWin: p2Data.didWin, opChoice: p1Choice})

    io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
}

module.exports = {
    rpsMeleeEvents,
}