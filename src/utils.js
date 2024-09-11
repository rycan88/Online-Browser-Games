import Cookies from "js-cookie";

export const generateNickname = () => {
    return "user_" + Math.floor(100000 + Math.random() * 900000);
}

export const getNickname = () => {
    return Cookies.get('nickname');
}

export const refreshPage = () => {
    window.location.reload();
};

export const sendRefreshBroadcast = () => {
    const channel = new BroadcastChannel('refresh_channel');
    channel.postMessage('refresh');
    channel.close(); // Close the channel after sending the message
}