import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

import '../css/Navbar.css';
import { Sidebar } from './Sidebar';
import { getNickname } from '../utils';
import useFullscreen from '../hooks/useFullscreen';

export const Navbar = () => {
    const [sidebarWidth, setSidebarWidth] = useState(-300);
    const isFullscreen = useFullscreen();

    return (
        <div className="navbar" style={{display: isFullscreen && "none"}}> 
            <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth}/>
            <div className="sidebarDiv" 
                onClick={() => {
                    setSidebarWidth(0);
                }}>
                <div />
            </div>
            <div className="leftNavItems">                
                <Link to="/home">Home</Link>
                <Link to="/games">Games</Link>
                <Link to="/about">About</Link>
            </div>
            <div className="middleNavItems">
                <Link to="/">Random Games Online</Link>
            </div>
            <div className="rightNavItems">
                <Link to="/profile">{getNickname()}</Link>
            </div>  
        </div> 
    );                                           
}