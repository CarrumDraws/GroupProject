import { Link } from 'react-router-dom';

import './NavBar.css';

function NavBar() {
    return (
        <div id="navBarContainer">
            <Link to="/" className='navLinks'>Home</Link>
            <div>
                <Link to="/profile" className="navLinks">Profile</Link>
                |
                <Link to="/visa" className='navLinks'>Visa Status Management</Link>
                |
                <Link to='/housing' className='navLinks'>Housing</Link>
            </div>
        </div>
    );
}

export default NavBar;