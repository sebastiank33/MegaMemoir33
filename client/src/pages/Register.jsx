import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Register = () => {

    //function to store user info using the UseState hook
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
    });

    //handle error for duplicat user
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    //function to handle use input
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handleRegister = async (e) => {
        e.preventDefault(); //so it doesnt refersh the page afer click
        try {
            await axios.post("/auth/register", user)
            //redirect to login page
            navigate('/login');
        } catch (error) {
            setError(error.response.data.message);
        }
    }


    return (
        <div className= "authentication"> 
            <h1> Register </h1>

            <form>
                <input required type="text" placeholder="Username" name='username' onChange={handleChange}/>
                <input required type="email" placeholder="Email" name='email' onChange={handleChange} />
                <input required type="password" placeholder="Password" name='password' onChange={handleChange} />

                <button onClick={handleRegister}>Register</button>

                {error && <p>{error}</p>}

                <span>Already have an account?
                    <Link to="/login">Login </Link>
                </span>
            </form>

        </div>
    ) 
}

export default Register
