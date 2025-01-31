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
import LoadingScreen from './components/LoadingScreen';
import { RPSMelee } from './pages/RPSMelee';
import { Hanabi } from './pages/Hanabi';

export const AppContext = createContext();
const socket = getSocket();

const gameNames = ["telepath", "thirty_one", "rock_paper_scissors_melee", "hana"]

function App() {
  const client = new QueryClient();
  const [rooms, setRooms] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const GameElement = (gameName, roomCode) => {
    if (gameName === "telepath") {
      return <Telepath roomCode={roomCode} />
    } else if (gameName === "thirty_one") {
      return <ThirtyOne roomCode={roomCode} />
    } else if (gameName === "rock_paper_scissors_melee") {
      return <RPSMelee roomCode={roomCode} />
    } else if (gameName === "hana") {
      return <Hanabi roomCode={roomCode} />
    }
    return <></>
  }

  const roomRoutes = (rooms) => {
    return Object.keys(rooms).map((roomCode) => {
      const gameName = rooms[roomCode];
      console.log(`/${gameName}/lobby/${roomCode}`)

      return <Route key={roomCode} 
                    path={`/${gameName}/lobby/${roomCode}`} 
                    element={<Room key={roomCode} gameName={gameName} roomCode={roomCode}/>} />
        }) 
  }

  const gameRoutes = (rooms) => {
    return Object.keys(rooms).map((roomCode) => {
      const gameName = rooms[roomCode];
      return <Route key={roomCode} 
                    path={`/${gameName}/${roomCode}`} 
                    element={GameElement(gameName, roomCode)} />
        }) 
  }

  const lobbyRoutes = () => {
    return gameNames.map((gameName) => {
      return (
        <Route key={gameName}
                path={`/${gameName}/lobby`} 
                element={<Lobby gameName={gameName}/>} 
          />
      );
    });
  }

  useEffect(() => {
    socket.on('update_rooms', (rooms) => {
        console.log("Rooms updated");
        setRooms(rooms);
        setIsDataLoaded(true);
    });

    socket.emit("get_all_rooms");

    return () => {
        socket.off('update_rooms');
    };
  }, []);

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
      <AppContext.Provider value={{ rooms, setRooms }}>
        <QueryClientProvider client={client}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Games />} />
              {lobbyRoutes()}
              {roomRoutes(rooms)}
              {gameRoutes(rooms)}
              <Route path="/hana" element={<Hanabi/>} />
              <Route path="/games" element={<Games/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/test" element={<TailwindTest />} />
              <Route path="/odd_colour_out" element={<OddColourOut />} />
              <Route path="/thirty_one" element={<ThirtyOne />} />
              <Route path="*" element={isDataLoaded ? <ErrorPage/> : <LoadingScreen />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AppContext.Provider>
    </div>


  );
}

export default App;
