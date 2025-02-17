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

// leaveAllRooms removes the current user's socket from all rooms, and replaces it with another socket with same socketid if found
const leaveAllRooms = (io, rooms, deleteTimers, currentSocket) => {
    if (!currentSocket) { return; }
    Object.keys(rooms).forEach((roomCode) => {
        const currentIndex = rooms[roomCode].players.findIndex(user => user.socketId === currentSocket.id);
        if (currentIndex === -1) { return; }

        //currentSocket.leave(roomCode);

        rooms[roomCode].spectators = rooms[roomCode].spectators.filter(user => user.socketId !== currentSocket.id);
        const otherAcc = rooms[roomCode].spectators.find(user => user.userId === currentSocket.id);

        if (otherAcc) {
            rooms[roomCode].players.splice(currentIndex, 1, otherAcc);
        } else {
            rooms[roomCode].players.splice(currentIndex, 1);
        }

        if (rooms[roomCode].players.length === 0) {
            if (!Object.keys(deleteTimers).includes(roomCode)) {
                startDeleteTimer(rooms, deleteTimers, roomCode);
            }
        } else {
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
            removeFromTeamList(io, rooms, roomCode, currentSocket.id, -1);
        }
    });
}

const addToTeamList = (rooms, roomCode, currentUser) => {
    if (!currentUser) { return; }
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
    if (firstEmptySpot != null) {
        teamData[firstEmptySpot].push(currentUser);
    } else {
        teamData.push([currentUser])
    }
}

const removeFromTeamList = (io, rooms, roomCode, currentUser, excludedIndex) => {
    if (!currentUser) { return; }
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

const startDeleteTimer = (rooms, deleteTimers, roomCode) => {
    deleteTimers[roomCode] = setTimeout(() => {
      if (rooms[roomCode] && rooms[roomCode].players.length === 0) {
        delete rooms[roomCode]; 
        console.log(`Room ${roomCode} deleted after 5 minutes of inactivity.`);
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };
  
  // Function to clear the delete timer if a player rejoins
  const clearDeleteTimer = (deleteTimers, roomCode) => {
    if (deleteTimers[roomCode]) {
      clearTimeout(deleteTimers[roomCode]); // Cancel the deletion timer
      delete deleteTimers[roomCode]; // Remove the timer reference
      console.log(`Deletion timer for room ${roomCode} canceled.`);
    }
  };

  const getSimplifiedRooms = (rooms) => {
    const simplifiedRooms = {}
    for (const roomCode of Object.keys(rooms)) {
        simplifiedRooms[roomCode] = rooms[roomCode].gameName;
    }
    return simplifiedRooms;
  }

module.exports = {
    User,
    getRoomLeader,
    leaveAllRooms,
    addToTeamList,
    removeFromTeamList,
    containsSocketId,
    containsUserId,
    startDeleteTimer,
    clearDeleteTimer,
    getSimplifiedRooms,
};