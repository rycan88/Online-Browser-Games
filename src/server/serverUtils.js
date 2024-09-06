
const getRoomLeader = (rooms, roomCode) => {
    if (rooms[roomCode].players.length > 0) {
        return rooms[roomCode].players[0];
    }
}

const leaveAllRooms = (io, rooms, userid) => {
    Object.keys(rooms).forEach((roomCode) => {
        rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== userid);
        if (rooms[roomCode].players.length === 0) {
            delete rooms[roomCode];
        } else {
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
        }
    });
}

const addToTeamList = (io, rooms, roomCode, userid) => {
    const teamData = rooms[roomCode].teamData
    for (const [index, team] of teamData.entries()) {
        if (team.length < 2) {
            teamData[index].push(userid);
            return;
        }    
    }
    teamData.push([userid])
    io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
}

const removeFromTeamList = (io, rooms, roomCode, userid, excludedIndex) => {
    const teamData = rooms[roomCode].teamData
    for (const [index, team] of teamData.entries()) {
        if (index === excludedIndex) { continue; }
        if (team.includes(userid)) {
            team.length === 1 
                ? teamData.splice(index, 1)
                : teamData[index] = teamData[index].filter(element => element !== userid);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
            return team.length === 1;
        }
   
    }
    return null;
}

class User {
    constructor(socketId, userId, nickname) {
      this.socketId = socketId;
      this.userId = userId;
      this.nickname = nickname;
    }
  }

module.exports = {
    getRoomLeader,
    leaveAllRooms,
    addToTeamList,
    removeFromTeamList,
    User,
};