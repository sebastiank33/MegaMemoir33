import express from 'express';
import {database} from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



const router = express.Router();

export const register = (req, res) => {
    //check if user with the same email or user exists by querying the database
    const q = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const user = [req.body.email, req.body.username];
    database.query(q, user, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server error'});
        }
        if (result && result.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        }

        //use bcryptjs to hash 
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //insert user into the database
        const insert = 'INSERT INTO users (`username`, `email`, `password`) VALUES (?)';
        const newUser = [req.body.username, req.body.email, hash];
        database.query(insert, [newUser], (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }
            res.status(200).json({message: 'User created'});
        });

    });




}

export const login = (req, res) => {

    const q = 'SELECT * FROM users WHERE username = ?';
    const user = [req.body.username];
    database.query(q, user, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server error'});
        }
        if (result && result.length > 0) {
            const user = result[0];
            const valid = bcrypt.compareSync(req.body.password, user.password);
            if (valid) {
                const {password, ...others} = user;

                const token = jwt.sign({id: user.id}, "secret");
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true
                });
                res.status(200).json(others); //only send password
            } else {
                res.status(400).json({message: 'Invalid credentials'});
            }
        } else {
            res.status(400).json({message: 'Invalid credentials'});
        }

    });
   
}

export const logout = (req, res) => {

    res.clearCookie('token');
    res.status(200).json({message: 'Logged out'});

}



//post method for registration, login, and logout because we are sending data to the server
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);






export default router;

