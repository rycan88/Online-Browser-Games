import { io } from "socket.io-client";
import { generateNickname } from "./utils";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// USE_COOKIES makes it easy to toggle cookies on and off for testing
const USE_COOKIES = true;

// socket Singleton so that we only connect to the socket once
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


const MY_WEBSITE_URL = process.env.NODE_ENV === 'production'
  ? 'https://rycan88-online-games.onrender.com'
  : 'http://localhost:3001';

const getSocket = () => {
    if (!socket) {
        const userId = getUserId();
        const nickname = getNickname();
        socket = io.connect(MY_WEBSITE_URL, {
            query: { userId, nickname }
        });
        socket.userId = userId;
        socket.nickname = nickname;
    }
    return socket;
}

export default getSocket;