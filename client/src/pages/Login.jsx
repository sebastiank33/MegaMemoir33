import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthorizationContext} from '../context/authorizationContext';


const Login = () => {

     //function to store user info using the UseState hook
     const [user, setUser] = useState({
        username: '',
        password: '',
    });

    //handle error for duplicat user
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {login} = useContext(AuthorizationContext);
    
   
    //function to handle use input
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handleRegister = async (e) => {
        e.preventDefault(); //so it doesnt refersh the page afer click
        try {

            await login(user);
            //redirect to login page
            navigate('/');

        } catch (error) {

            setError(error.response.data.message);
        }
    }


    return (
        <div className= "authentication"> 
            <h1> Login </h1>

            <form>
                <input type="text" placeholder="Username" name="username" onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleChange} />

                <button onClick={handleRegister}>Login</button>

                {error && <p>{error}</p>}

                <span>Don't have an account?
                    <Link to="/register">Register </Link>
                </span>
            </form>
        </div>
    ) 
}

export default Login
