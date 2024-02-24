import express from 'express';
import {database} from '../database.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

//functions
export const getPosts = (req, res) => {
    //make sure to check cat, if there is a category, get posts with that category, if there is not get all 
    //posts
    const q = req.query.cat ? 'SELECT * FROM posts WHERE cat = ?' : 'SELECT * FROM posts';
    const cat = req.query.cat;
    database.query(q, cat, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server error'});
        }
        res.status(200).json(result);
    });
}

export const getPost = (req, res) => {

    //get username, title, desc, img, cat and date of post
    //however we have to join tables 
    const q = 'SELECT p.id, u.username, p.title, p.desc, p.img AS post_img, u.img AS user_img, p.cat, p.date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?';    
    const id = req.params.id;
    database.query(q, id, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server error'});
        }
        res.status(200).json(result[0]);
    });



}
export const createPost = (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Unvalid token'});
        }
        const insert = 'INSERT INTO posts (`title`, `desc`,`img`, `cat`, `date`, `uid`) VALUES (?)';
        const post = [req.body.title, req.body.desc, req.body.img, req.body.cat, new Date(), user.id];
        database.query(insert, [post], (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }
            res.status(200).json({message: 'Post created'});
        });
    });
}


export const updatePost = (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Unvalid token'});
        }
        const update = 'UPDATE posts SET `title` = ?, `desc` = ?, `img` = ?, `cat` = ? WHERE `id` = ? AND `uid` = ?';
        const id = req.params.id;
        const post = [req.body.title, req.body.desc, req.body.img, req.body.cat, id, user.id];
        database.query(update, post, (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }
            res.status(200).json({message: 'Post updated'});
        });

        
    });

}
export const deletePost = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Unvalid token'});
        }
        const q = 'SELECT * FROM posts WHERE `id` = ? AND `uid` = ?';
        const id = req.params.id;
        database.query(q, [id, user.id], (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }
            if (result.length === 0 || result[0].uid !== user.id) {
                return res.status(403).json({message: 'Forbidden'});
            }
            const deleteQuery = 'DELETE FROM posts WHERE `id` = ?';
            database.query(deleteQuery, id, (err, result) => {
                if (err) {
                    return res.status(500).json({message: 'Server error'});
                }
                res.status(200).json({message: 'Post deleted'});
            });
        });
    });
}






router.get('/', getPosts );
router.get('/:id', getPost);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost );









export default router;

