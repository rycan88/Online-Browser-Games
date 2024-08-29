

const express = require("express");

const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const telepathHelper = require("./telepathHelper");
const { telepathPlayerData } = require("./telepathPlayerData");

// Lobby Rooms
const rooms = {};

const getRoomLeader = (roomCode) => {
    if (rooms[roomCode].players.length > 0) {
        return rooms[roomCode].players[0];
    }
}

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.emit('update_rooms', Object.keys(rooms))

    io.emit('update_rooms', Object.keys(rooms));

    socket.on('create_room', (gameName, roomCode) => {
        rooms[roomCode] = { players: [], gameName: gameName, gameStarted: false, playersData: {}};
        socket.join(roomCode);
        rooms[roomCode].players.push(socket.id);
        io.emit('update_rooms', Object.keys(rooms));
        socket.emit('update_players', rooms[roomCode].players);
      });
    
    socket.on('join_room', (roomCode) => {
        if (rooms[roomCode]) {
            socket.join(roomCode);
            rooms[roomCode].players.push(socket.id);
            io.to(roomCode).emit('update_players', rooms[roomCode].players);
        } else {
            console.log(`${roomCode} does not exist`);
            socket.emit('room_error', 'Room does not exist');
        }
    });

    socket.on('leave_room', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.includes(socket.id)) {
            socket.leave(roomCode);
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
            } else {
                io.to(roomCode).emit('update_players', rooms[roomCode].players);
            }
        } else {
            console.log(`${socket.id} is not in ${roomCode}`);
            socket.emit('room_error', 'Player is not in this room');
        }        
    });
    
    socket.on('start_game', (roomCode) => {
        if (rooms[roomCode] && !rooms[roomCode].gameStarted) {
            rooms[roomCode].gameStarted = true;
            io.to(roomCode).emit('game_started');
            if (rooms[roomCode].gameName === "telepath") {
                const playersData = {}
                const players = rooms[roomCode].players
                players.forEach((player, index) => {
                    let partner = index % 2 === 0 ? players[index + 1] : players[index - 1];
                    playersData[player] = telepathPlayerData(player, partner, 0);
                });
                rooms[roomCode].playersData = playersData;
                console.log("data", playersData);
            }

        }
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle cleanup of lobbies and players
        Object.keys(rooms).forEach((roomCode) => {
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
            } else {
                io.to(roomCode).emit('update_players', rooms[roomCode].players);
            }
        });
    });

    socket.on('get_all_rooms', () => {
        io.emit('update_rooms', Object.keys(rooms));
    });

    socket.on('get_all_players', (roomCode) => {
        if (rooms[roomCode]) {
            io.emit('update_players', rooms[roomCode].players);
        }
    });

    socket.on('get_players_data', (roomCode) => {
        if (rooms[roomCode]) {
            io.emit('receive_players_data', rooms[roomCode].playersData);
            console.log("start", rooms[roomCode].playersData);
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
        const roomLeader = getRoomLeader(roomCode);
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
            socket.emit('receive_telepath_prompt', rooms[roomCode]);
            socket.emit('receive_players_data', rooms[roomCode].playersData);
            if (!Object.values(rooms[roomCode].playersData).find((data) => data.hasPickedWords === false)) {
                io.to(roomCode).emit("receive_results_state", true);
            }
        }
    });
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});