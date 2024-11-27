import DropdownComponent from "./dropdown";
import { DateTime } from "luxon";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import heart from "../assets/heart.png";
import message from "../assets/message.png";

export default function PostDetails () {
    const [post, setPost] = useState(null);
    const { postId } = useParams();
    
    useEffect(() => {
        const getPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}`, { 
                    credentials: "include",
                });
                const data = await response.json();
                console.log("Fetched post data:", data);
                setPost(data);
                
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        getPostDetails();
    }, [postId]);
    
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
                            <DropdownComponent editPost={()=>handleEditToggle(post.id)} deletePost={()=>handleDelete(post.id)}/>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2 pl-16">
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
                </div>
            ) : null }
        </div>
    )
}