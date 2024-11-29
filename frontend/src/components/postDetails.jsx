import DropdownComponent from "./dropdown";
import { DateTime } from "luxon";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import heart from "../assets/heart.png";
import message from "../assets/message.png";
import { useNavigate } from 'react-router-dom';

export default function PostDetails ({username}) {
    const [post, setPost] = useState(null);
    const [postMessages, setPostMessages] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    const { postId } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const getPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}`, { 
                    credentials: "include",
                });
                const data = await response.json();
                console.log("Fetched post data:", data);
                setPost(data);
                setPostMessages(data.message);
                setPostLikes(data.like);

            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
        console.log(postId, "postid, params")
        getPostDetails();
    }, [postId]);

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
            headers: { 'Content-Type': 'application/json'},
            credentials: "include",
            mode: 'cors',
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete the post: ${errorMessage}`);
          }
          
        setIsEditMode(false);
        navigate(-1)
        } catch (error) {
          console.log(error)
        }
    }

    const handleEditToggle = (id) => {
        setIsEditMode(prev => !prev);
    }

    const formattedDate = post?.created_at? DateTime.fromISO(post.created_at).toLocaleString({ month: "short", day: "2-digit" }) : "";
    
    return (
        
        <div className="flex flex-col">
            {post ? (
                <div className="flew flex-col w-[800px] max-w-[800px] text-left">
                    <div className="flex flex-row gap-4 w-full ">
                        <a href="/profile">
                            <img src={post.user.profile_image} className="rounded-full w-[50px] h-[50px]"/>
                        </a>

                        <div className="flex gap-2 mt-[7px] w-full justify-between">
                            <div className="flex gap-2">
                                <a href="/profile">{post.user.username}</a>
                                <p>{formattedDate}</p>
                            </div>
                            
                            {username === post.user.username? (
                                <DropdownComponent editPost = {() => handleEditToggle(postId) } deletePost = {() => handleDelete(postId) }/>
                            ) :  (<div></div>)
                        }
                        </div>

                    </div>

                    <div className="flex flex-col gap-2 pl-16">
                        <p className="w-full break-words">{post.content}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 pl-16">
                        {post.post_image && <img src={post.post_image} alt="post image" />}
                    </div>

                    <div className="flex flex-row justify-between pl-[64px]">

                        <div className="flex flex-row gap-2 items-start">
                            <img src={message} className="w-[25px] h-[25px]" alt="Messages" />
                            <p>{post.message?.length || 0}</p>
                        </div>
                        
                        <div className="flex flex-row gap-2 items-start pr-[3px]">
                            <img src={heart} className="w-[25px] h-[25px]" alt="Likes" />
                            <p>{post.like?.length || 0}</p>
                        </div>
 
                    </div>
                </div>
            ) : null }
        </div>
    )
}