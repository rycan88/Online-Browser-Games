const rpsMeleeEvents = (io, socket, rooms) => {    
    socket.on("get_all_rps_melee_data", (roomCode) => {
        if (!rooms[roomCode]) { return; }

        socket.emit('receive_players_data', rooms[roomCode].playersData);
    });

    socket.on("rps_melee_choose", (roomCode, choice) => {
        if (!rooms[roomCode]) { return; }
        const playersData = rooms[roomCode].playersData;
        if (playersData[socket.userId].choice) { return; }

        playersData[socket.userId].choice = choice;
        
        io.to(roomCode).emit('receive_players_data', playersData);

        if (rooms[roomCode].gameData.currentRound === 0) {
            for (const player of Object.keys(playersData)) {
                if (!playersData[player].choice) {
                    return;
                }
            }

            setTimeout(() => {
                startRound(io, socket, rooms, roomCode);
            }, 500)

        }
    });
}

const startRound = (io, socket, rooms, roomCode) => {
    const roundLimit = rooms[roomCode].gameData.roundLimit;
    const currentRound = rooms[roomCode].gameData.currentRound;
    
    const playersData = rooms[roomCode].playersData;
    for (const player of Object.keys(playersData)) {
        playersData[player].choice = null;
    }

    rooms[roomCode].gameData.currentRound += 1;

    io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);

    if (currentRound > roundLimit ) {
        rooms[roomCode].gameData.currentRound = 0;
        return;
    }

    const roundInterval = rooms[roomCode].gameData.roundInterval;
    io.to(roomCode).emit("round_started", Date.now(), roundInterval);
    setTimeout(() => {
        io.to(roomCode).emit("round_ended");
        calculateScore(io, socket, rooms, roomCode);
        startRound(io, socket, rooms, roomCode);
    }, roundInterval)
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
        return; 
    } else if (!p1Choice || losingMatchups[p2Choice] === p1Choice) {
        p2Data.score += 1;
    } else if (!p2Choice || losingMatchups[p1Choice] === p2Choice) {
        p1Data.score += 1;
    } else {
        console.log("ERROR: Choice should not be possible", p1Choice, p2Choice);
        return;
    }

    io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
}

module.exports = {
    rpsMeleeEvents,
}