import React from 'react';
import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const Home = () => {

  const [posts, setPosts] = useState([]);

  const location  = useLocation();
  //category has the format of ?cat=Sports
  const cat = location.search;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/posts' + cat);
      setPosts(res.data);
    };
    fetchPosts();
  }, [cat]); //whenever we change cat we want to refetch the posts
  

  return (
    <div className='home'>
      {posts.map((post) => (
        <div className='post' key={post.id}>
          <div className='img'>
            <img src={`../images/${post.img}`} alt="" />
          </div>
          <div className='content'>
            <Link className = "link" to={`/post/${post.id}`}>
              <h1>{post.title}</h1>
              <p>{post.desc}</p>
              <button>Read more</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
