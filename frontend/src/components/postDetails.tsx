import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DateTime } from "luxon";
import DropdownComponent from "./dropdown";
import heart from "../assets/heart.png";
import message from "../assets/message.png";
import API_URL from "../config";
import {Post, User, Comment} from "../interfaces";
import { PostDetailsProps } from "../types";

const PostDetails: React.FC<PostDetailsProps> = ({ username }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [textComment, setTextComment] = useState<string>("");
  const [postMessages, setPostMessages] = useState<Comment[]>([]);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [postLikes, setPostLikes] = useState<User[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const { postId } = useParams<{ postId: string }>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const navigate = useNavigate();
  const { handleSubmit } = useForm();


  useEffect(() => {
    const getPostDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
          credentials: "include",
        });
        const data = await response.json();
        setCommentCount(data.comment.length)
        setPost(data);
        setPostMessages(data.comment);
        setPostLikes(data.like.user);

        // if logged in user is the same as likedUsername, make logic to unlike
        const likedUsernames = data.like.map((like) => like.user.username);
        if (likedUsernames.includes(username)) {
          setPostLiked(true);
          setBackgroundColor("lightblue");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    getPostDetails();
  }, [postId, username]);

  async function createNewComment() {
    if (!textComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", textComment);
      const response = await fetch(
        `${API_URL}/comments/${postId}/new-comment`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Server Error:", errorResponse);
        alert(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const newComment = await response.json();
      setTextComment("");
      window.location.reload();
    } catch (error) {
      console.error("Failed to create new comment:", error);
    }
  }

  async function likePost() {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/like`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Server Error:", errorResponse);
        alert(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      setPostLiked(true);
      setBackgroundColor("lightblue");
      window.location.reload();
    } catch (error) {
      console.error();
    }
  }

  async function unlikePost() {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/unlike`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
        },
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Server Error:", errorResponse);
        alert(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      setPostLiked(false);
      setBackgroundColor("transparent");
      window.location.reload();
    } catch (error) {
      console.error();
    }
  }

  const editPost = async (data) => {
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

      const updatedPost = await response.json();
      setIsEditMode(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
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
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditToggle = (content) => {
    setEditedContent(content);
    setIsEditMode((prev) => !prev);
  };

  const formattedDate = post?.created_at
    ? DateTime.fromISO(post.created_at).toLocaleString({
        month: "short",
        day: "2-digit",
      })
    : "";

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 text-left shadow-md p-4">
      {post ? (
        <div>
          <div className="flex flex-row gap-4 w-full ">
            <Link to="/profile">
              <img
                src={post.user.profile_image}
                className="rounded-full w-[50px] h-[50px]"
              />
            </Link>

            <div className="flex gap-2 mt-[7px] w-full justify-between">
              <div className="flex gap-2">
                <Link to={`/users/${post.user.username}`}>
                  {post.user.username}
                </Link>
                <p>{formattedDate}</p>
              </div>

              {username === post.user.username ? (
                <DropdownComponent
                  postId={post.id}
                  editPost={() => handleEditToggle(post.content)}
                  deletePost={() => handleDelete(postId)}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pl-16">
            {isEditMode ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={editPost}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="w-full break-words">{post.content}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 pl-16">
            {post.post_image && <img src={post.post_image} alt="post image" />}
          </div>

          <div className="flex flex-row justify-between pl-[64px] py-[15px]">
            <div className="flex flex-row gap-2 items-start">
              <img src={message} className="w-[25px] h-[25px]" alt="Messages" />
              <p>{commentCount}</p>
            </div>

            <div className="flex flex-row gap-2 items-start pr-[3px]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const likedUsernames = post.like.map(
                    (like) => like.user.username,
                  );

                  if (!likedUsernames.includes(username)) {
                    likePost();
                  } else {
                    unlikePost();
                  }
                }}
              >
                <img
                  src={heart}
                  className="w-[25px] h-[25px]"
                  alt="Likes"
                  style={{ backgroundColor, borderRadius: "50%" }}
                />
              </button>
              <p>{post.like.length || 0}</p>
            </div>
          </div>

          <form
            className="pl-[60px] flex flex-col"
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit(createNewComment)}
          >
            <p>Comments</p>

            {postMessages.length ? (
              postMessages.map((comment) => {
                const formattedDate = DateTime.fromISO(
                  comment.created_at,
                ).toLocaleString({ month: "short", day: "2-digit" });

                return (
                  <div>
                    <li key={comment.id} className="list-none">
                      <div className="flex flex-row gap-[19px] w-full">
                        <Link to={`/users/${post.user.username}`}>
                          <img
                            src={comment.user.profile_image}
                            className="rounded-full w-[60px] h-[55px]"
                          />
                        </Link>

                        <div className="flex gap-2 mt-[7px] w-full justify-between">
                          <div className="flex gap-2">
                            <Link to={`/users/${post.user.username}`}>
                              {comment.user.username}
                            </Link>
                            <p>{formattedDate}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col pl-4 md:pl-8">
                        <p className="w-full break-words pl-[44px]">
                          {comment.content}
                        </p>
                      </div>
                    </li>
                  </div>
                );
              })
            ) : (
              <p>No comments</p>
            )}
            
            {username &&
              <div>
                <h4>Leave a comment</h4>
                <div className="flex flex-row gap-2">
                  <textarea
                    name="textComment"
                    value={textComment}
                    maxLength={8000}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      setTextComment(target.value);
                      if (target.value === "") {
                        target.style.height = "30px";
                      } else {
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }
                    }}
                    className="min-h-[100px] max-h-[400px] w-full px-4 py-2 bg-base-100 border shadow-sm border-slate-300 
                    placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                    block rounded-md sm:text-sm focus:ring-1 overflow-auto resize-none"
                    placeholder="Leave a comment, max 8000 characters"
                  ></textarea>
                </div>
                <button
                type="submit"
                className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-2 rounded focus:outline-none focus:shadow-outline w-[150px]"
                >
                Comment
                </button>
              </div>
            }

          </form>
        </div>
      ) : null}
    </div>
  );
}

export default PostDetails;