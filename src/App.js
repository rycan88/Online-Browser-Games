import './App.css';

import { SignupPage } from './pages/SignupPage';
import { Home } from "./pages/Home";
import { Telepath } from "./pages/Telepath";
import { TailwindTest } from "./pages/TailwindTest";
import { Navbar } from "./components/Navbar";
import { OddColourOut } from './pages/OddColourOut';
import { Lobby } from "./components/Lobby";
import { Room } from  "./components/Room";

import { createContext, useState } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppContext = createContext();

function App() {
  const client = new QueryClient();
  const [rooms, setRooms] = useState([]);
  const gameName = "telepath";

  const roomRoutes = (gameName, rooms) => {
    console.log("Updated")
    return rooms.map((roomCode) => {
      return <Route key={roomCode} 
                    path={`/${gameName}/lobby/${roomCode}`} 
                    element={<Room key={roomCode} gameName={gameName} roomCode={roomCode}/>} />
        }) 
  }

  const gameRoutes = (rooms) => {
    console.log("Updated")
    return rooms.map((roomCode) => {
      return <Route key={roomCode} 
                    path={`/telepath/${roomCode}`} 
                    element={<Telepath roomCode={roomCode} />} />
        }) 
  }

  return (
    <div className="App">
      <AppContext.Provider value={{ rooms, setRooms }}>
        <QueryClientProvider client={client}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/telepath/lobby" element={<Lobby game="Telepath"/>} />
              {roomRoutes(gameName, rooms)}
              {gameRoutes(rooms)}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/test" element={<TailwindTest />} />
              <Route path="/odd_colour_out" element={<OddColourOut />} />
              <Route path="*" element={<h1>PAGE NOT FOUND. YOU ARE AT THE WRONG LINK. FEELS BAD MAN.</h1>} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AppContext.Provider>
    </div>


  );
}

export default App;
