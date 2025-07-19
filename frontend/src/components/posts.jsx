import heart from "../assets/heart.png";
import message from "../assets/message.png";
import { DateTime } from "luxon";
import { useState } from "react";
import { useEffect } from "react";
import API_URL from "../config";

export default function Posts({ userId, loggedInUserId }) {
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState(null);

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
        const data = await response.json();
        console.log(data)

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
      cancelEdit();
      setEditPostId(null);
      setEditedContent("");
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditToggle = (id, content) => {
    setEditPostId(id);
    setEditedContent(content);
    setIsEditMode((prev) => !prev);
  };

  return (
    <ul className="flex flex-col gap-6 pt-[40px]">
      {posts.length ? (
        posts.map((post) => {
          const formattedDate = DateTime.fromISO(
            post.created_at,
          ).toLocaleString({ month: "short", day: "2-digit" });

          return (
            <div className="flex flex-row mr-[20px] w-full">
              <a href={`/posts/${post.id}`}>
                <li key={post.id} className="bg-base-200 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex flex-row gap-[19px] mt-[7px] items-center justify-between">
                    <div className="shrink-0 w-[45px] h-[45px]">
                      <a href={`/users/${post.user.username}`}>
                        <img
                          src={post.user.profile_image}
                          className="rounded-full w-[60px] h-[45px]"
                          alt="Profile"
                        />
                      </a>
                    </div>

                    <div className="flex gap-2 mt-[7px] w-full justify-between">
                      <div className="flex gap-2">
                        <a href={`/users/${post.user.username}`} className="no-underline text-base-content hover:underline">
                          {post.user.username}
                        </a>
                        <p className="no-underline text base-content">{formattedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col pl-[25px] text-left">
                    {editPostId === post.id ? (
                      <div>
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              saveEdit(post.id), setIsEditing(false);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="w-full break-words pl-[55px] mb-0">
                        {post.content}
                      </p>
                    )}

                    {post.post_image && (
                      <img
                        src={post.post_image}
                        alt=""
                        className="rounded-md mt-2"
                      />
                    )}
                  </div>

                  <div className="flex flex-row gap-4 mt-3 pl-16">
                    <div className="flex items-start gap-1 text-sm text-gray-400 hover:text-primary cursor-pointer">
                      <img
                        src={message}
                        className="w-5 h-5 no-underline text base-content"
                        alt="Messages"
                      />
                      <p>{post.comment.length || 0}</p>
                    </div>

                    <div className="flex items-start gap-1 text-sm text-gray-400 hover:text-primary cursor-pointer">
                      <img
                        src={heart}
                        className="w-5 h-5 no-underline text base-content"
                        alt="Likes"
                      />
                      <p>{post.like.length || 0}</p>
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
