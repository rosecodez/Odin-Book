import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import heart from "../assets/heart.png";
import message from "../assets/message.png";
import NewPost from "./newPost";
import { FeedProps } from "../types";
import { DateTime } from "luxon";
import API_URL from "../config";
import { Post } from "../interfaces";

const Feed: React.FC<FeedProps> = ({  isVisitor, setIsVisitor }) => {
  const [image, setImage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, {
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
        endpoint = `${API_URL}/posts/all-posts-visitor`;
      } else {
        endpoint = `${API_URL}/posts/all-posts`;
      }

      try {
        const response = await fetch(endpoint, {
          credentials: "include",
        });

        const data: Post[] = await response.json();
        console.log(data)
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [isVisitor]);

  const editPost = async (postId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editedContent }),
        },
      );

      if (!response.ok) {
        throw new Error("Error updating post");
      }

      await response.json();
      cancelEdit();
      setEditPostId(null);
      setEditedContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete the post: ${errorMessage}`);
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditToggle = (id: number) => {
    setEditPostId((prev) => (prev === id ? null : id));
    //reset textarea
    setEditedContent("");
  };

  const cancelEdit = () => {
    setEditPostId(null);
    setEditedContent("");
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 text-left shadow-md p-4">
      <div className="flex gap-3">
        {!isVisitor && (
          <img src={image} className="rounded-full w-[70px] h-[70px]" />
        )}

        <NewPost isVisitor={isVisitor}/>
      </div>

      <ul className="flex flex-col gap-6 pt-[40px]">
        
          <p>No posts available</p>

      </ul>
    </div>
  );
}

export default Feed;