class User {
    constructor(socketId, userId, nickname) {
        this.socketId = socketId;
        this.userId = userId;
        this.nickname = nickname;
    }
}

const containsSocketId = (lst, socketId) => {
    return lst.find(user => user.socketId === socketId);
}

const containsUserId = (lst, userId) => {
    return lst.find(user => user.userId === userId);
}

const getRoomLeader = (rooms, roomCode) => {
    if (rooms[roomCode].players.length > 0) {
        return rooms[roomCode].players[0];
    }
}

const leaveAllRooms = (io, rooms, currentUser) => {
    Object.keys(rooms).forEach((roomCode) => {
        const currentIndex = rooms[roomCode].players.findIndex(user => user.socketId === currentUser.socketId);
        if (currentIndex === -1) { return; }

        rooms[roomCode].spectators = rooms[roomCode].spectators.filter(user => user.socketId !== currentUser.socketId);
        const otherAcc = rooms[roomCode].spectators.find(user => user.userId === currentUser.userId);

        if (otherAcc) {
            rooms[roomCode].players.splice(currentIndex, 1, otherAcc);
        } else {
            rooms[roomCode].players.splice(currentIndex, 1);
        }

        if (rooms[roomCode].players.length === 0) {
            delete rooms[roomCode];
        } else {
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
            removeFromTeamList(io, rooms, roomCode, currentUser, -1);
        }
    });
}

const addToTeamList = (rooms, roomCode, currentUser) => {
    const teamData = rooms[roomCode].teamData;
    
    let firstEmptySpot = null;
    for (const [index, team] of teamData.entries()) {
        if (team.length < 2 && firstEmptySpot === null) {
            firstEmptySpot = index;
        }
        if (containsUserId(team, currentUser.userId)) {
            return;            
        }    
    }
    if (firstEmptySpot !== null) {
        teamData[firstEmptySpot].push(currentUser);
    } else {
        teamData.push([currentUser])
    }
}

const removeFromTeamList = (io, rooms, roomCode, currentUser, excludedIndex) => {
    const teamData = rooms[roomCode].teamData;
    for (const [index, team] of teamData.entries()) {
        if (index === excludedIndex) { continue; }
        if (containsUserId(team, currentUser.userId)) {
            team.length === 1 
                ? teamData.splice(index, 1)
                : teamData[index] = teamData[index].filter(user => user.userId !== currentUser.userId);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
            return team.length === 1;
        }
   
    }
    return null;
}




module.exports = {
    User,
    getRoomLeader,
    leaveAllRooms,
    addToTeamList,
    removeFromTeamList,
    containsSocketId,
    containsUserId,
};