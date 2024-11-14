import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import camera from "../assets/camera.png";
import heart from "../assets/heart.png";
import message from "../assets/message.png";

import { DateTime } from "luxon";

export default function Feed() {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  let [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([])

  useEffect(() => {
      fetch(`http://localhost:3000/users/profile`,  {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            navigate("/login");
            throw new Error("User is not logged in, redirected to login page");
          }
          return response.json();
        })
        .then(data => {
          setUsername(data.user.username);
          setImage(data.user.profile_image);
          console.log("Profile data:", data);
        })
        .catch(error => {
          console.error("Error fetching profile data:", error);
        });
  
  }, [navigate]);
    
  const sendPostText = async () => {
      if (postText === "") {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/posts/new-post`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                text: postText
            }),
        });

        if (!response.ok) {
        console.error("Failed to send post");
        }
        const newPost = await response.json();

        console.log(newPost)
        setPostText("");
        window.location.reload();
      } catch (error) {
          console.error("Error in sendPostText:", error);
      }
  };

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts/all-posts", { 
          credentials: "include" 
        });
        const data = await response.json();""
        console.log("posts:", data);
        setPosts(data);
      } catch (error) {
        console.error("Posts error", error);
      }
    };

    getAllPosts();
  }, []);


  return (
      <div className="flex flex-col gap-2 max-w-[600px] w-[600px] text-left">
          <form className="flex flex-col" method="POST" encType="multipart/form-data" onSubmit={handleSubmit(sendPostText)}>
              <div className="flex flex-row gap-2">
              <img src={image} className="rounded-full w-[70px] h-[70px]" />

                <textarea
                  name="text"
                  value={postText}
                  onInput={(e) => {
                    setPostText(e.target.value);
                      if (e.target.value === '') {
                          e.target.style.height = '30px'
                      } else {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${e.target.scrollHeight}px`;
                      }
                  }}
                  
                  className="min-h-[100px] max-h-[400px] w-[600px] px-4 py-2 bg-white border shadow-sm border-slate-300 
                      placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                      block rounded-md sm:text-sm focus:ring-1 overflow-auto resize-none"
                  placeholder="What is happening?"
                ></textarea>
              </div>
              <div className="flex flex-row gap-2 justify-between pl-[75px]">
                <img src={camera} alt="camera" className="w-10 h-10 cursor-pointer bg-white p-1"/>
                <button type="submit" className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-2 rounded focus:outline-none focus:shadow-outline">Post</button>
              </div>
          </form>

          <ul className="flex flex-col gap-4">
            {posts.map((post) => {
              let formattedDate = DateTime.fromISO(post.created_at).toLocaleString({ month: 'short', day: '2-digit' });

              return (
                  <li key={post.id} className="flex flex-col">

                    <div className="flex flex-row gap-4">
                      <img src={post.user.profile_image} className="rounded-full w-[50px] h-[50px]"/>
                      <div className="flex gap-2 items-center">
                        <a href="/profile">{post.user.username}</a>
                        <p>{formattedDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-16">
                      <p className="max-w-[540px] break-words">{post.content}</p>
                      <img src={post.post_image}/>
                    </div>
                    <div className="flex flex-row justify-between pl-[64px]">
                      <div className="flex flex-row gap-2 items-center">
                        <img src={message} className="w-[25px] h-[25px]" alt="messages"/>
                        <p>0</p>
                      </div>

                      <div className="flex flex-row gap-2 items-center pr-[3px]">
                        <img src={heart} className="w-[25px] h-[25px]" alt="likes"/>
                        <p>0</p>
                      </div>
                    </div>
                  </li>
            );
            })}
          </ul>

    
      </div>
  )
}
