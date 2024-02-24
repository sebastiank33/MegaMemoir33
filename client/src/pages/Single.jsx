import React from 'react'
import DeleteIcon  from '../images/deleteIcon.png'
import EditIcon from '../images/editIcon.png'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { useContext } from 'react'
import { AuthorizationContext } from '../context/authorizationContext'
import { useNavigate } from 'react-router-dom'



const Single = () => {

    const [post, setPost] = useState([]); //single post

    const location  = useLocation();
    //we only need the id at the end 
    const path = location.pathname.split("/")[2];

    const {user} = useContext(AuthorizationContext);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPosts = async () => {
        const res = await axios.get('/posts/' + path);
        setPost(res.data);
        };
        fetchPosts();
    }, [path]); //whenever we change cat we want to refetch the posts

    const deleteHandler = async () => {
        try {
            await axios.delete(`/posts/${path}`);
            navigate("/");
        }
        catch (err) {}
    }

    return (
        <div className = 'single'>  

            <div className = 'content'> 
            <img src={`../images/${post.img}`} alt="" />

                <div className = 'selfie'>  
                    {post.user_img && <img src={post.user_img} alt="" />}

                    <div className = 'username'>
                            <span> {post.username}</span>
                            <p1>Post Date: {moment(post.date).fromNow()}</p1>
                        
                    </div>

                    <div className='editDelete'>
                        {user && user.username === post.username && (
                            <>
                                <Link to={"/write?edit=2"} state={post}>
                                    <img src={EditIcon} alt="" />
                                </Link>
                                <img onClick={deleteHandler} src={DeleteIcon} alt="" />
                            </>
                        )}
                    </div>
                
                </div>
                <h2> {post.title}</h2>
                <p> 
                    {post.desc}
              </p>
            </div>
            <Sidebar cat={post.cat} currentPostTitle={post.title}/>
        
        
        </div>
    )
}

export default Single

