import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';


const Sidebar = ({cat, currentPostTitle}) => {

  const [posts, setPosts] = useState([]);

  //category has the format of ?cat=Sports
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/posts/?cat=' + cat);
      // console.log(res.data);
      setPosts(res.data.filter((p) => p.title !== currentPostTitle));
      console.log(res.data);
    };
    fetchPosts();
  }, [cat, currentPostTitle]); //whenever we change cat we want to refetch the posts

    return (
        <div className = 'sidebar'>
            <h1>Recommended Content</h1>

            {posts.map((post) => (
                <div className='post' key={post.id}>
                    <div className='img'>
                        <img src={post.img} alt="" />
                        <h2>{post.title}</h2>
                        <button> Read More </button>
                    </div>
                    
                </div>
            ))}

        </div>
    );
};

export default Sidebar;
