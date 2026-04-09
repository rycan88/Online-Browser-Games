import { useParams, Navigate } from "react-router-dom";

export const LobbyRedirect = ({rooms, gameName}) => {
    const { roomCode } = useParams();

    // No room code -> send to base lobby
    if (!roomCode || roomCode.length > 4) {
        return <Navigate to={`/${gameName}/lobby`} replace />;
    }

    // Valid room -> redirect to full lobby URL
    if (rooms[roomCode]) {
        return <Navigate to={`/${rooms[roomCode]}/lobby/${roomCode}`} replace />;
    }

    // Invalid room -> go back to base lobby
    return <Navigate to={`/${gameName}/lobby`} replace />;
}
