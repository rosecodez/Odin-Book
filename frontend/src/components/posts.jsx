import heart from "../assets/heart.png";
import message from "../assets/message.png";
import DropdownComponent from "./dropdown";
import { DateTime } from "luxon";
import { useState } from "react";
import { useEffect } from "react";

export default function Posts() {
    const [posts, setPosts] = useState([])
    const [postId, setPostId] = useState("");
    const [post, setPost] = useState(null);
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState([]);
    const [editPostId, setEditPostId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        const getAllPosts = async () => {
          try {
            const response = await fetch("http://localhost:3000/posts/profile-all-posts", { 
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
    }, [])
    
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
        <ul className="flex flex-col gap-6 pt-[40px]">
            {posts.length ? (
                posts.map((post) => {
                const formattedDate = DateTime.fromISO(post.created_at).toLocaleString({ month: 'short', day: '2-digit' });

                    return (
                        <div>
                            <a href={`/${post.id}`}>
                                <li key={post.id}>

                                    <div className="flex flex-row gap-[19px] w-full">
                                        <a href="/profile">
                                            <img src={post.user.profile_image} className="rounded-full w-[50px] h-[50px]"/>
                                        </a>
                                        <div className="flex gap-2 mt-[7px] w-full justify-between">
                                            <div className="flex gap-2">
                                                <a href="/profile">{post.user.username}</a>
                                                <p>{formattedDate}</p>
                                            </div>
                                            <DropdownComponent editPost={()=>handleEditToggle(post.id)} deletePost={()=>handleDelete(post.id)}/>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pl-16">

                                        {editPostId === post.id ? (
                                            <div>
                                                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 border rounded"/>
                                                <div className="flex gap-2 mt-2">
                                                <button onClick={() => {saveEdit(post.id), setIsEditing(false);}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">Save</button>
                                                <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded">Cancel</button>
                                                </div>
                                            </div>
                                            ) : (
                                                <p className="w-full break-words">{post.content}</p>
                                            )
                                        }
                                        {post.post_image && <img src={post.post_image} alt="post image" />}
                                    </div>

                                    <div className="flex flex-row justify-between pl-[64px]">
                                        <div className="flex flex-row gap-2 items-start">
                                            <img src={message} className="w-[25px] h-[25px]" alt="Messages" />
                                            <p>0</p>
                                        </div>

                                        <div className="flex flex-row gap-2 items-start pr-[3px]">
                                            <img src={heart} className="w-[25px] h-[25px]" alt="Likes" />
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
  );
}