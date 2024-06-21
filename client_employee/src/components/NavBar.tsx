import { Link } from 'react-router-dom';

import './NavBar.css';

function NavBar() {
    return (
        <div id="navBarContainer">
            <Link to="/employee/profile" className='navLinks'>Home</Link>
            <div>
                <Link to="/employee/profile" className="navLinks">Profile</Link>
                |
                <Link to="/employee/visa" className='navLinks'>Visa Status Management</Link>
                |
                <Link to='/employee/housing' className='navLinks'>Housing</Link>
            </div>
        </div>
    );
}

export default NavBar;