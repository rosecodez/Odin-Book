import { useState } from "react";
import { useForm } from "react-hook-form";
import camera from "../assets/camera.png";
import API_URL from "../config";
import { NewPostProps } from "../types";

const NewPost: React.FC<NewPostProps> = ({ isVisitor }) => {
  const [postText, setPostText] = useState<string>("");
  const { handleSubmit } = useForm();
  const [postImage, setPostImage] = useState<File | null>(null);

  const sendPostText = async () => {
    if (postText === "" && !postImage) {
      return;
    }

    try {
      const formData = new FormData();

      if (postText) {
        formData.append("text", postText);
      }

      if (postImage) {
        formData.append("image", postImage);
      }

      const response = await fetch(`${API_URL}/posts/new-post`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Server Error:", errorResponse);
        alert(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      await response.json();
      setPostText("");
      setPostImage(null);
      window.location.reload();
    } catch (error) {
      console.error("Error in sendPostText:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {!isVisitor && (
        <form
          className="flex flex-col"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit(sendPostText)}
        >
          <div className="flex flex-row gap-2">
            <textarea
              name="text"
              value={postText}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setPostText(target.value);
                target.style.height = "auto";
                target.style.height =
                target.value === "" ? "30px" : `${target.scrollHeight}px`;
              }}
              className="min-h-[100px] max-h-[400px] w-full px-4 py-2 bg-base-100 border shadow-sm border-slate-300 
                        placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                        block rounded-md sm:text-sm focus:ring-1 overflow-auto resize-none"
              placeholder="What is happening?"
            ></textarea>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <label>
              <img
                src={camera}
                alt="camera"
                className="w-10 h-10 cursor-pointer bg-base-100 p-1"
              />
              <input
                type="file"
                name="image"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPostImage(e.target.files[0]);
                  }
                }}
              />
            </label>
            <button
              type="submit"
              className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewPost;