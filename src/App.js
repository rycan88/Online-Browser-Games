import './App.css';

import { SignupPage } from './pages/SignupPage';
import { Home } from "./pages/Home";
import { Telepath } from "./pages/Telepath";
import { TailwindTest } from "./pages/TailwindTest";
import { Navbar } from "./components/Navbar";
import { OddColourOut } from './pages/OddColourOut';
import { Sidebar } from './components/Sidebar';

import { createContext } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppContext = createContext();

function App() {
  const client = new QueryClient();

  return (
    <div className="App">
      <AppContext.Provider value={{ }}>
        <QueryClientProvider client={client}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/telepath" element={<Telepath />} />
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
