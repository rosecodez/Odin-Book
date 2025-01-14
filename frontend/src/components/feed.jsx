import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import heart from "../assets/heart.png";
import message from "../assets/message.png";
import NewPost from "./newPost";

import { DateTime } from "luxon";

export default function Feed({ isAuthenticated, isVisitor, setIsVisitor }) {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  let [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/users/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    })
    
    .then((response) => {
      if (!response.ok) {
        navigate("/login");
        throw new Error("User is not logged in, redirected to login page");
      }
      return response.json();
    })

    .then((data) => {
      if (data.user.isVisitor) {
        setIsVisitor(data.user.isVisitor);
        setUsername(data.user.isVisitor ? "visitor" : data.user.username);
      } else {
        console.error(data);
      }
      setImage(data.user.profile_image || "");
    })

    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });

  }, [navigate]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      let endpoint;
  
      if (isVisitor) {
        endpoint = "http://localhost:3000/posts/all-posts-visitor";
      } else {
        endpoint = "http://localhost:3000/posts/all-posts";
      }
  
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
        });
  
        if (!response.ok) {
          console.error("Error fetching posts:", response.statusText);
          return;
        }
  
        const data = await response.json();
        console.log("posts", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, [isVisitor]);
  
  const editPost = async (data) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content: editedContent }),
        });

        if (!response.ok) {
            throw new Error("Error updating post");
        }

        const updatedPost = await response.json();
        cancelEdit();
        setEditPostId(null);
        setEditedContent("");
        setIsEditMode(false);
    } catch (error) {
        console.error(error);
    }
  }

  const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
    
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to delete the post: ${errorMessage}`);
        }
        
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        setIsEditMode(false);
      } catch (error) {
        setError(error.message);
      }
  }

  const handleEditToggle = (id) => {
      setPostId(id)
      setIsEditMode(prev => !prev);
  }

  const cancelEdit = () => {
      setEditPostId(null);
      setEditedContent("");
  }

  return (
    <div className="flex flex-col max-w-[800px] text-left">

      <div className="flex gap-3">
        { !isVisitor  &&  <img src={image} className="rounded-full w-[70px] h-[70px]" />}

        <NewPost isVisitor={isVisitor} setIsVisitor={setIsVisitor}/>
      </div>

      <ul className="flex flex-col gap-6 pt-[40px]">
            {posts.length ? (
                posts.map((post) => {
                const formattedDate = DateTime.fromISO(post.created_at).toLocaleString({ month: 'short', day: '2-digit' });

                    return (
                        <div>

                            <a href={`/posts/${post.id}`}>

                                <li key={post.id}>

                                    <div className="flex flex-row gap-[19px] w-full">

                                        <a href={`/users/${post.user.username}`}>
                                            <img src={post.user.profile_image} className="rounded-full w-[50px] h-[50px] sm:w-[45px] sm:h-[45px] md:w-[60px] md:h-[50px]"/>
                                        </a>

                                        <div className="flex gap-2 mt-[7px] w-full justify-between">
                                            <div className="flex gap-2">
                                                <a href={`/users/${post.user.username}`}>
                                                    {post.user.username}
                                                </a>
                                                <p>{formattedDate}</p>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="flex flex-col pl-4 md:pl-8">

                                        {editPostId === post.id ? (
                                            <div>
                                                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 border rounded"/>
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => {saveEdit(post.id), setIsEditing(false);}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">Save</button>
                                                    <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded">Cancel</button>
                                                </div>
                                            </div>
                                            ) : (
                                                <p className="w-full break-words pl-[44px]">{post.content}</p>
                                            )
                                        }

                                        {post.post_image && <img src={post.post_image} className="mt-4 max-w-full h-auto rounded-md" alt="post image" />}

                                    </div>

                                    <div className="flex flex-row justify-between pl-[64px]">

                                        <div className="flex flex-row gap-2 items-start">
                                            <img src={message} className="w-[25px] h-[25px] sm:w-[20px] sm:h-[20px]" alt="Messages" />
                                            <p>0</p>
                                        </div>

                                        <div className="flex flex-row gap-2 items-start pr-[3px]">
                                            <img src={heart} className="w-[25px] h-[25px] sm:w-[20px] sm:h-[20px]" alt="Likes" />
                                            <p>0</p>
                                        </div>

                                    </div>

                                </li>

                            </a>

                        </div>
                        
                    );
                })
            ) : (
                <p>No posts available</p>
            )}
        </ul>
    </div>
  );
}
