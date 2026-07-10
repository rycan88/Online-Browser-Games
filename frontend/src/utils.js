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

const EIGHT_HOURS = 8 * 60 * 60 * 1000;
export const getPSTDate = () => {
    return new Date(Date.now() - EIGHT_HOURS).toISOString().slice(0, 10);
}

export const getNextResetDiff = () => {
    const now = new Date();

    // Get current time in Pacific Time
    const pstNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );

    // Create reset time (1:00 AM today in PST/PDT)
    const reset = new Date(pstNow);
    reset.setHours(1, 0, 0, 0);

    // If already past, move to tomorrow
    if (pstNow >= reset) {
      reset.setDate(reset.getDate() + 1);
    }

    // 🔑 Convert that PST time back into a real UTC timestamp

    const diff = reset.getTime() - Date.now();
    const totalSeconds = Math.floor(diff / 1000);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return { hours, minutes, seconds};
}