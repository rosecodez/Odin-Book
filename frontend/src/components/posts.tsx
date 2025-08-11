import heart from "../assets/heart.png";
import message from "../assets/message.png";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import API_URL from "../config";
import { Link } from "react-router-dom";
import { Post } from "../interfaces";
import { PostsProps } from "../types";

const Posts: React.FC<PostsProps> = ({ userId, loggedInUserId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        let endpoint;
        if (userId === loggedInUserId) {
          endpoint = `${API_URL}/posts/profile-all-posts`;
        } else if (userId) {
          endpoint = `${API_URL}/posts/users/${userId}`;
        } else {
          endpoint = `${API_URL}/posts/all-posts`;
        }

        const response = await fetch(endpoint, {
          credentials: "include",
        });
        
        const data: Post[] = await response.json();
        console.log(data)

        setPosts(data);
      } catch (error) {
        console.error("Posts error", error);
        setError(error.message);
      }
    };
    getAllPosts();
  }, [userId, loggedInUserId]);

  const cancelEdit = () => {
    setEditPostId(null);
    setEditedContent("");
  };

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
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete the post: ${errorMessage}`);
      }

      setIsEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditToggle = (id: number, content: string) => {
    setEditPostId(id);
    setEditedContent(content);
    setIsEditMode((prev) => !prev);
  };

  return (
    <p>No posts available</p>

  );
}

export default Posts;