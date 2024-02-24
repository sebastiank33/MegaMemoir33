import React from 'react';
import Logo from '../images/sebLogo.png';
import { Link } from 'react-router-dom';
import {AuthorizationContext} from '../context/authorizationContext';
import { useContext } from 'react';

const Navbar = () => {

    const {user, logout} = useContext(AuthorizationContext);
    return (
        <div className='navigation'>
            <div className='navContainer'>
                <div className = 'logo'>
                    <img src= {Logo} alt = ""/>
                
                </div>
                <div className = 'links'>

                    <Link className='link' to="/">
                        <h6 style={{ textDecoration: 'underline' }}>Home</h6>
                    </Link>


                    <Link className= 'link' to="/?cat=Sports"> 
                        <h6>Sports</h6> 
                    
                    </Link> 
                    <Link className= 'link' to="/?cat=Fitness"> 
                        <h6>Fitness</h6> 
                    
                    </Link> 
                    <Link className= 'link' to="/?cat=Fashion"> 
                        <h6>Fashion</h6> 
                    
                    </Link>

                    {user && <span>{user.username}</span>}
                    {user ? (
                        <span onClick={logout}>Logout</span>
                    ) : (
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    )}
                    <span className = "write"> 
                        <Link className="link" to= "/write">Write</Link>
                    </span>
                
                </div>
            </div>
        </div>
    )
}

export default Navbar;
