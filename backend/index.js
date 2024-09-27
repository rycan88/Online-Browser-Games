const express = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

// --------------------------deployment----------------------------------------

const _dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname1, "frontend/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(_dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment----------------------------------------
const MY_WEBSITE_URL = process.env.NODE_ENV === 'production'
  ? 'https://rycan88-online-games.onrender.com'
  : 'http://localhost:3000';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: MY_WEBSITE_URL,
        methods: ["GET", "POST"],
    },
});


const { User, leaveAllRooms, addToTeamList, removeFromTeamList ,containsSocketId, containsUserId, startDeleteTimer, clearDeleteTimer, getSimplifiedRooms} = require("./serverUtils");
const { Deck } = require("./cards/Deck");
const { setUpPlayerData, setUpGameData } = require("./gameUtils");
const { telepathEvents } = require("./telepath/telepathEvents");
const { thirtyOneEvents } = require("./thirty-one/thirtyOneEvents");

// Lobby Rooms
const rooms = {};
const teamGames = ["telepath"];
const deleteTimers = {};
// Our socket has a socketId, userId, and nickname
// socketId changes per tab, while userId changes per browser

// rooms[roomCode].players are the unique players in the lobby
// rooms[roomCode].spectators can include the same userId more than once, but different socketId

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const nickname = socket.handshake.query.nickname;
    const currentUser = new User(socket.id, userId, nickname);
    socket.userId = userId;
    socket.nickname = nickname;
    console.log(`User Connected: ${socket.id} ${userId} ${nickname} `);

    socket.emit('update_rooms', getSimplifiedRooms(rooms))

    socket.on('nickname_changed', (nickname) => {
        currentUser.nickname = nickname
        Object.keys(rooms).forEach((roomCode) => {
            const isInRoom = rooms[roomCode].players.find(user => user.userId === currentUser.userId);
            if (!isInRoom) { return; }

            rooms[roomCode].players = 
                rooms[roomCode].players.map((player) => {
                    if (player.userId === currentUser.userId) {
                        player.nickname = nickname;
                    }
                    return player;
                }
            );

            rooms[roomCode].teamData = 
                rooms[roomCode].teamData.map((team) => {
                    return team.map((player) => {
                        if (player.userId === currentUser.userId) {
                            player.nickname = nickname;
                        }
                        return player;
                    })

                }
            );
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
        });
    });

    socket.on('create_room', (gameName, roomCode) => {
        leaveAllRooms(io, rooms, socket.id);
        rooms[roomCode] = { players: [], spectators: [], gameName: gameName, gameStarted: false, playersData: {}, teamData: [], gameData: {}, teamMode: false };
        if (gameName === "telepath") {
            rooms[roomCode].teamMode = true;
        }
        socket.join(roomCode);
        rooms[roomCode].players.push(currentUser);
        rooms[roomCode].spectators.push(currentUser);

        io.emit('update_rooms', getSimplifiedRooms(rooms));
        if (teamGames.includes(gameName)) {
            addToTeamList(rooms, roomCode, currentUser);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
        } 
        socket.emit('update_players', rooms[roomCode].players);
      });
    
    socket.on('join_room', (roomCode) => {
        if (!rooms[roomCode]) {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        } else if (rooms[roomCode].gameStarted && !Object.keys(rooms[roomCode].playersData).includes(socket.userId)) { // If they arent a player in the game that started
            socket.emit('room_error', `Game ${roomCode} has already started`);
        } else if (!containsSocketId(rooms[roomCode].players, socket.id)) { // If the socket is not already connected to the room
            clearDeleteTimer(deleteTimers, roomCode);
            socket.leaveAll();
            leaveAllRooms(io, rooms, deleteTimers, currentUser);
            socket.join(roomCode);
            rooms[roomCode].spectators.push(currentUser);
            if (!containsUserId(rooms[roomCode].players, socket.userId)) {
                rooms[roomCode].players.push(currentUser);
            }
            if (teamGames.includes(rooms[roomCode].gameName)) {
                addToTeamList(rooms, roomCode, currentUser);
                io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
            } 
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
        }
    });

    socket.on('leave_room', (roomCode) => {
        if (rooms[roomCode] && containsSocketId(rooms[roomCode].players, socket.id)) {
            socket.leave(roomCode);
            rooms[roomCode].players = rooms[roomCode].players.filter(user => user.socketId !== socket.id);
            rooms[roomCode].spectators = rooms[roomCode].spectators.filter(user => user.userId !== socket.userId);

            if (rooms[roomCode].players.length === 0) {
                if (!Object.keys(deleteTimers).includes(roomCode)) {
                    startDeleteTimer(rooms, deleteTimers, roomCode);
                }
            } else {
                if (teamGames.includes(rooms[roomCode].gameName)) {
                    removeFromTeamList(io, rooms, roomCode, currentUser, -1);
                }    
                io.to(roomCode).emit('update_players', rooms[roomCode].players);
            }
        } else {
            socket.emit('room_error', 'Player is not in this room');
        }        
    });
    
    socket.on('start_game', (roomCode) => {
        if (rooms[roomCode] && !rooms[roomCode].gameStarted) {
            setUpPlayerData(rooms, roomCode);
            setUpGameData(rooms, roomCode);
            rooms[roomCode].gameStarted = true;
            io.to(roomCode).emit('game_started');
        }
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle cleanup of lobbies and players
        socket.leaveAll();
        leaveAllRooms(io, rooms, deleteTimers, currentUser);
    });

    socket.on('set_team_mode', (roomCode, teamMode) => {
        if (rooms[roomCode] && !rooms[roomCode].gameStarted) {
            rooms[roomCode].teamMode = teamMode;
            io.to(roomCode).emit('update_team_mode', teamMode);
        }
    });

    socket.on('get_all_rooms', () => {
        io.emit('update_rooms', getSimplifiedRooms(rooms));
    });

    socket.on('get_all_players', (roomCode) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
            io.to(roomCode).emit('update_team_mode', rooms[roomCode].teamMode);
        }
    });

    socket.on('get_players_data', (roomCode) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
        }
    });
    
    socket.on('join_diff_team', (roomCode, index) => {
        if (rooms[roomCode]) {
            const teamData = rooms[roomCode].teamData;
            const isLast = index - 1 === teamData.length; 
            if (isLast) {
                teamData.push([currentUser]);
            } else {
                teamData[index - 1].push(currentUser);
            }
            removeFromTeamList(io, rooms, roomCode, currentUser, index - 1);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
        }
    });

    telepathEvents(io, socket, rooms);
    thirtyOneEvents(io, socket, rooms);

})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("SERVER IS RUNNING");
});