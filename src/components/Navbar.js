import { Link } from 'react-router-dom';
import { useState } from "react";

import '../css/Navbar.css';
import { Sidebar } from '../components/Sidebar';

export const Navbar = () => {
    const [sidebarWidth, setSidebarWidth] = useState(-400);

    return (
        <div className="navbar"> 
            <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth}/>
            <div className="sidebarDiv" 
                onClick={() => {
                    setSidebarWidth(0);
                }}>
                <div />
            </div>
            <div className="leftNavItems">                
                <Link to="/">Home</Link>
                <Link to="/telepath">Telepath</Link>
                <Link to="/odd_colour_out">Odd Colour Out</Link>
            </div>
            <div className="middleNavItems">
                <Link to="/">Cool Games Online</Link>
            </div>
            <div className="rightNavItems">
                <Link to="/signup">Log In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>  
        </div> 
    );                                           
}