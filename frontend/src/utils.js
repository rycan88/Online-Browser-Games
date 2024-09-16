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

export const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
}