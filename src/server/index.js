

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

// Lobby Rooms
const rooms = {};
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.emit('update_rooms', Object.keys(rooms))

    io.emit('update_rooms', Object.keys(rooms));

    socket.on('create_room', (gameName, roomCode) => {
        rooms[roomCode] = { players: [], gameName: gameName, gameStarted: false };
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
                console.log(rooms[roomCode].players)
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
        if (rooms[roomCode] && !rooms[roomCode].gameStarted) {
            io.emit('update_players', rooms[roomCode].players);
        }
    });

    // Telepath
    socket.on("send_telepath_words", (data) => {
        socket.broadcast.emit("receive_telepath_words", data);
    })

    socket.on("send_telepath_ready", () => {
        socket.broadcast.emit("receive_telepath_ready");
    })

    socket.on("get_telepath_prompt", (roomCode) => {
        const prompt = telepathHelper.generateNewWord();
        const wordLimit = telepathHelper.generateWordLimit();
        console.log(prompt, wordLimit);
        io.to(roomCode).emit('receive_telepath_prompt', {prompt: prompt, wordLimit: wordLimit});
    });
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});