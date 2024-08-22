import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <div className="navbar"> 
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