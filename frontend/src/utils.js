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

export const getPlayerCoords = (playerCount, width, height, centerX, centerY) => {
    const positions = [];
    for (let i = 0; i < playerCount; i++) {
      const angle = (i / playerCount) * 2 * Math.PI + Math.PI / 2;
      const x = centerX + (width / 2) * Math.cos(angle);
      const y = centerY + (height / 2) * Math.sin(angle);
      positions.push([x, y]);
    }

    return positions;
}