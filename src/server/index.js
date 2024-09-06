const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const telepathHelper = require("./telepath/telepathHelper");
const { telepathPlayerData } = require("./telepath/telepathPlayerData");
const { getRoomLeader, leaveAllRooms, addToTeamList, removeFromTeamList, User } = require("./serverUtils");

// Lobby Rooms
const rooms = {};
const teamGames = ["telepath"];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const nickname = socket.handshake.query.nickname;
    const currentUser = new User(socket.id, userId, nickname);
    console.log(`User Connected: ${socket.id} ${userId} ${nickname} `);

    socket.emit('update_rooms', Object.keys(rooms))

    io.emit('update_rooms', Object.keys(rooms));

    socket.on('create_room', (gameName, roomCode) => {
        leaveAllRooms(io, rooms, socket.id);
        rooms[roomCode] = { players: [], gameName: gameName, gameStarted: false, playersData: {}, teamData: [] };
        socket.join(roomCode);
        rooms[roomCode].players.push(socket.id);
        io.emit('update_rooms', Object.keys(rooms));
        if (teamGames.includes(gameName)) {
            addToTeamList(io, rooms, roomCode, socket.id)
        } 
        socket.emit('update_players', rooms[roomCode].players);
      });
    
    socket.on('join_room', (roomCode) => {
        if (!rooms[roomCode]) {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        } else if (rooms[roomCode].gameStarted) {
            socket.emit('room_error', `Game ${roomCode} has already started`);
        } else if (!rooms[roomCode].players.includes(socket.id)) {
            leaveAllRooms(io, rooms, socket.id);
            socket.join(roomCode);
            rooms[roomCode].players.push(socket.id);
            if (rooms[roomCode].gameName === "telepath") {
                addToTeamList(io, rooms, roomCode, socket.id)
            } 
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
        }
    });

    socket.on('leave_room', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.includes(socket.id)) {
            socket.leave(roomCode);
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
            } else {
                if (rooms[roomCode].gameName === "telepath") {
                    removeFromTeamList(io, rooms, roomCode, socket.id, -1)
                }    
                io.to(roomCode).emit('update_players', rooms[roomCode].players);
            }
        } else {
            socket.emit('room_error', 'Player is not in this room');
        }        
    });
    
    socket.on('start_game', (roomCode) => {
        if (rooms[roomCode] && !rooms[roomCode].gameStarted) {
            if (rooms[roomCode].gameName === "telepath") {
                const teamData = rooms[roomCode].teamData
                const players = rooms[roomCode].players
                if (teamData.length * 2 !== players.length) { 
                    console.log("Shouldn't be able to start");
                    return; 
                }
                
                const playersData = {}
                teamData.forEach((team) => {
                    playersData[team[0]] = telepathPlayerData(team[0], team[1], 0);
                    playersData[team[1]] = telepathPlayerData(team[1], team[0], 0);
                });
                rooms[roomCode].playersData = playersData;
            }
            rooms[roomCode].gameStarted = true;
            io.to(roomCode).emit('game_started');
        }
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle cleanup of lobbies and players
        leaveAllRooms(io, rooms, socket.id);
    });

    socket.on('get_all_rooms', () => {
        io.emit('update_rooms', Object.keys(rooms));
    });

    socket.on('get_all_players', (roomCode) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
        }
    });

    socket.on('get_players_data', (roomCode) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
            console.log("start", rooms[roomCode].playersData);
        }
    });
    
    socket.on('join_diff_team', (roomCode, userid, index) => {
        if (rooms[roomCode]) {
            const teamData = rooms[roomCode].teamData;
            const isLast = index - 1 === teamData.length; 
            if (isLast) {
                teamData.push([userid]);
            } else {
                teamData[index - 1].push(userid);
            }
            removeFromTeamList(io, rooms, roomCode, userid, index - 1);
            io.to(roomCode).emit('update_team_data', rooms[roomCode].teamData);
        }
    });

    // Telepath

    // Triggers when a player is ready to send their wordList
    socket.on("send_telepath_words", (roomCode, chosenWords) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;
            playersData[socket.id].chosenWords = chosenWords; 
            playersData[socket.id].hasPickedWords = true;


            if (!Object.values(playersData).find((data) => data.hasPickedWords === false)) {
                io.to(roomCode).emit("receive_results_state", true);    
                telepathHelper.calculateScores(playersData);
            }
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    socket.on("unsend_telepath_words", (roomCode) => {
        if (rooms[roomCode]) {
            const playersData = rooms[roomCode].playersData;
            playersData[socket.id].chosenWords = []; 
            playersData[socket.id].hasPickedWords = false;
            io.to(roomCode).emit("receive_players_data", playersData);
        }
    })

    // Triggers when player is ready for a new word
    socket.on("send_telepath_ready", (roomCode) => {
        if (rooms[roomCode]) {
            let playersData = rooms[roomCode].playersData;
            playersData[socket.id].isReady = true;

            if (!Object.values(playersData).find((data) => data.isReady === false)) {
                Object.values(playersData).forEach((userData) => {
                    playersData[userData.username] = telepathPlayerData(userData.username, userData.partner, userData.totalScore);
                })
                io.to(roomCode).emit("receive_results_state", false);    
            }      
            io.to(roomCode).emit("receive_players_data", playersData); 
        }
    })

    socket.on("generate_telepath_prompt", (roomCode) => {
        const roomLeader = getRoomLeader(rooms, roomCode);
        if (rooms[roomCode] && roomLeader === socket.id) {
            const prompt = telepathHelper.generateNewWord();
            const wordLimit = telepathHelper.generateWordLimit();
            rooms[roomCode].prompt = prompt;
            rooms[roomCode].wordLimit = wordLimit;
            console.log(prompt, wordLimit);
            io.to(roomCode).emit('receive_telepath_prompt', {prompt: prompt, wordLimit: wordLimit});
        }
    });

    socket.on("get_telepath_prompt", (roomCode) => {
        if (rooms[roomCode]) {
            const prompt = rooms[roomCode].prompt ?? "";
            const wordLimit = rooms[roomCode].wordLimit ?? 0;
            socket.emit('receive_telepath_prompt', {prompt: prompt, wordLimit: wordLimit});
        }
    });
    
    socket.on("get_all_telepath_data", (roomCode) => {
        if (rooms[roomCode]) {
            if (!(socket.id in rooms[roomCode].playersData)) {
                socket.emit('room_error', `Game ${roomCode} has already started`);
                return;
            }
            socket.emit('receive_telepath_prompt', rooms[roomCode]);
            socket.emit('receive_players_data', rooms[roomCode].playersData);
            if (!Object.values(rooms[roomCode].playersData).find((data) => data.hasPickedWords === false)) {
                io.to(roomCode).emit("receive_results_state", true);
            }
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});