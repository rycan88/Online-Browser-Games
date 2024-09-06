import { io } from "socket.io-client";
import { generateNickname } from "./utils";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
// socket Singleton so that we only connect to the socket once
const USE_COOKIES = true;
let socket = null;

const getUserId = () => {
    let userId = Cookies.get("userId");
    if (!userId || !USE_COOKIES) {
        userId = uuidv4();
        Cookies.set('userId', userId, { expires: 365});
    }
    return userId;
}

const getNickname = () => {
    let nickname = Cookies.get("nickname");
    if (!nickname || !USE_COOKIES) {
        nickname = generateNickname();
        Cookies.set('nickname', nickname, { expires: 365});
    }
    return nickname;
}

const getSocket = () => {
    if (!socket) {
        const userId = getUserId();
        const nickname = getNickname();
        socket = io.connect("http://localhost:3001", {
            query: { userId, nickname }
        });
    }
    return socket;
}

export default getSocket;