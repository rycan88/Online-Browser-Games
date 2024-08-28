import { io } from "socket.io-client";

// socket Singleton so that we only connect to the socket once
let socket = null;

const getSocket = () => {
    if (!socket) {
        socket = io.connect("http://localhost:3001");
    }
    return socket;
}

export default getSocket;