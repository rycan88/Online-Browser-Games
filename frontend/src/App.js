import './App.css';

import { SignupPage } from './pages/SignupPage';
import { Home } from "./pages/Home";
import { Telepath } from "./pages/Telepath";
import { TailwindTest } from "./pages/TailwindTest";
import { Navbar } from "./components/Navbar";
import { OddColourOut } from './pages/OddColourOut';
import { Lobby } from "./components/lobby/Lobby";
import { Room } from  "./components/lobby/Room";

import { createContext, useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import getSocket from "./socket";
import { ErrorPage } from './pages/ErrorPage';
import { Profile } from './pages/Profile';
import { refreshPage } from './utils';
import { Games } from './pages/Games';
import { enterFullScreen } from './utils';
import { ThirtyOne } from './pages/ThirtyOne';

export const AppContext = createContext();
const socket = getSocket();

function App() {
  const client = new QueryClient();
  const [rooms, setRooms] = useState([]);
  const [gameNames, setGameNames] = useState({});
  const GameElement = (gameName, roomCode) => {
    if (gameName === "telepath") {
      return <Telepath roomCode={roomCode} />
    } else if (gameName === "thirty_one") {
      return <ThirtyOne roomCode={roomCode} />
    }
    return <></>
  }

  const roomRoutes = (gameNames, rooms) => {
    return rooms.map((roomCode) => {
      const gameName = gameNames ? gameNames[roomCode] : "";

      return <Route key={roomCode} 
                    path={`/${gameName}/lobby/${roomCode}`} 
                    element={<Room key={roomCode} gameName={gameName} roomCode={roomCode}/>} />
        }) 
  }

  const gameRoutes = (gameNames, rooms) => {
    return rooms.map((roomCode) => {
      const gameName = gameNames ? gameNames[roomCode] : "";
      console.log(gameNames, roomCode)
      return <Route key={roomCode} 
                    path={`/${gameName}/${roomCode}`} 
                    element={GameElement(gameName, roomCode)} />
        }) 
  }

  useEffect(() => {
    socket.on('update_rooms', (rooms, gameNames) => {
        console.log("Rooms updated");
        if (gameNames !== null) {
          setGameNames(gameNames);
        }
        setRooms(rooms);
    });

    socket.emit("get_all_rooms");

    return () => {
        socket.off('update_rooms');
    };
  }, []);
  console.log("YEE", rooms, gameNames)
  useEffect(() => {
    const channel = new BroadcastChannel('refresh_channel');

    channel.onmessage = (event) => {
      if (event.data === 'refresh') {
        refreshPage();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  return (
    <div className="App">
      <AppContext.Provider value={{ rooms, setRooms, gameNames }}>
        <QueryClientProvider client={client}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/telepath/lobby" element={<Lobby game="telepath"/>} />
              <Route path="/thirty_one/lobby" element={<Lobby game="thirty_one"/>} />
              {roomRoutes(gameNames, rooms)}
              {gameRoutes(gameNames, rooms)}
              <Route path="/games" element={<Games/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/test" element={<TailwindTest />} />
              <Route path="/odd_colour_out" element={<OddColourOut />} />
              <Route path="/thirty_one" element={<ThirtyOne />} />
              <Route path="*" element={<ErrorPage/>} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AppContext.Provider>
    </div>


  );
}

export default App;
