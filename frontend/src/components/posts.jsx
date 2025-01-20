import heart from "../assets/heart.png";
import message from "../assets/message.png";
import DropdownComponent from "./dropdown";
import { DateTime } from "luxon";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Posts({ userId, loggedInUserId}) {
    const [posts, setPosts] = useState([])
    const [editPostId, setEditPostId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllPosts = async () => {
          try {
            let endpoint
            if(userId === loggedInUserId) {
                endpoint = "http://localhost:3000/posts/profile-all-posts"
            } else if(userId) {
                endpoint = `http://localhost:3000/posts/users/${userId}`;
            } else {
                endpoint = "http://localhost:3000/posts/all-posts"
            }

            const response = await fetch(endpoint, {
              credentials: "include" 
            });
            const data = await response.json();
            setPosts(data);
          } catch (error) {
            console.error("Posts error", error);
            setError(error.message);
          }
        };

        if (userId) {
            getAllPosts();
        }
        
    }, [userId, loggedInUserId]);
    
    const editPost = async (postId) => {
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
            headers: { 'Content-Type': 'application/json'},
            credentials: "include",
            mode: 'cors',
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete the post: ${errorMessage}`);
          }
          
            setIsEditMode(false);
        } catch (error) {
          console.log(error)
        }
    }

    const handleEditToggle = (id, content) => {
        setEditPostId(id); 
        setEditedContent(content); 
        setIsEditMode((prev) => !prev);
      };
    
    return (
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
                                            <img src={post.user.profile_image} className="rounded-full w-[60px] h-[55px]"/>
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

                                    <div className="flex flex-col pl-[25px] text-left">

                                        {editPostId === post.id ? (
                                            <div>
                                                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 border rounded"/>
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => {saveEdit(post.id), setIsEditing(false);}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">Save</button>
                                                    <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded">Cancel</button>
                                                </div>
                                            </div>
                                            ) : (
                                                <p className="w-full break-words pl-[40px] mb-0">{post.content}</p>
                                            )
                                        }

                                        {post.post_image && <img src={post.post_image} className="max-w-full  rounded-md object-contain" alt="post image" />}

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
  );
}