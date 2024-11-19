import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import camera from "../assets/camera.png";
import heart from "../assets/heart.png";
import message from "../assets/message.png";
import threedots from "../assets/3dots.png"
import DropdownComponent from "./dropdown";
import { DateTime } from "luxon";

export default function Profile({ isVisitor, setIsVisitor }) {
  const { register, handleSubmit } = useForm();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [posts, setPosts] = useState([])

  const [modalVisibility, setModalVisibility] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/users/profile`,  {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          navigate("/login");
          throw new Error("User is not logged in, redirected to login page");
        }
        return response.json();
      })
      .then(data => {
        if (data.user.isVisitor) {
          setIsVisitor(true);
          setUsername("visitor");
          setImage(data.user.profile_image);
        } else {
          setIsVisitor(false);
          setUsername(data.user.username);
          setImage(data.user.profile_image);
        }
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
        navigate("/login");
      });

  }, [navigate]);

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
  }, []);

  const showModal = () => setModalVisibility(true);
  const hideModal = () => setModalVisibility(false);

  const onSubmit = async (data) => {
    const profilePicture = document.getElementById("profilePicture");
    const file = profilePicture.files[0]; 
    console.log(file)

    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)

    try {
      const response = await fetch("http://localhost:3000/users/update-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const uploadData = await response.json();
      console.log("Upload successful:", uploadData);
      hideModal();
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  const handleEditToggle = () => {
    setIsEditMode(prev => !prev);
  };

  return (
    <div className="flew flex-col max-w-[600px] w-[600px] text-left">
      <div className="flex flex-row gap-4">
        <div className="relative w-[150px] h-[160px]">
          <img src={image} className="outline outline-offset-2 outline-gray-500 rounded-full w-[150px] h-[160px]" />
          <img src={camera} alt="camera" onClick={showModal} className="absolute bottom-2 right-2 w-10 h-10 cursor-pointer bg-white rounded-full p-1"/>
        </div>
        <h2 className="text-2xl bold pt-8">{username}</h2>
      </div>

      {modalVisibility && (
          <div id="profileModal" className="pt-6 w-fit">
            <form id="UpdateProfilePicture" onSubmit={handleSubmit(onSubmit)} className="flex flex-col" method="POST" encType="multipart/form-data" action="">
              <div className="flex flex-row gap-4">
                <label htmlFor="profilePicture">Choose a profile picture:</label>
                <input type="file" {...register("image")} id="profilePicture" name="file" accept="image/png, image/jpeg" required/>
              </div>

              <div className="flex flex-row gap-2">
                <button type="button" className="mt-6 bg-red-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={hideModal}>Cancel</button>
                <button type="submit" className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update</button>
              </div>
            </form>
          </div>
      )}

      <ul className="flex flex-col gap-6 pt-[40px]">
        {posts.map((post) => {
          let formattedDate = DateTime.fromISO(post.created_at).toLocaleString({ month: 'short', day: '2-digit' });

          if (isEditMode) {
            return (
              <form onSubmit={handleSubmit(handleUpdate)} className="edit-post-form">
                <textarea {...register('content', { required: true })} defaultValue={post.content} className="focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500resize-y rounded-md shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                {errors.content && <p className="text-red-500">Content is required</p>}

                <button type="submit" className="mt-6 bg-green-500 hover:bg-green-900 text-white font-bold rounded py-2 px-4 focus:outline-none focus:shadow-outline">Update Post</button>
            </form> )
          } else {
            return (
                <li key={post.id} className="flex flex-col">

                  <div className="flex flex-row gap-4 w-full">
                    <a href="/profile">
                      <img src={post.user.profile_image} className="rounded-full w-[50px] h-[50px]"/>
                    </a>
                    <div className="flex gap-2 mt-[7px] w-full justify-between">
                      <div className="flex gap-2">
                        <a href="/profile">{post.user.username}</a>
                        <p>{formattedDate}</p>
                      </div>
                      <DropdownComponent />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pl-16">
                    <p className="max-w-[540px] break-words ">{post.content}</p>
                    <img src={post.post_image}/>
                  </div>
                  <div className="flex flex-row justify-between pl-[64px]">
                    <div className="flex flex-row gap-2 items-center">
                      <img src={message} className="w-[25px] h-[25px]" alt="messages"/>
                      <p>0</p>
                    </div>

                    <div className="flex flex-row gap-2 items-center pr-[3px]">
                      <img src={heart} className="w-[25px] h-[25px]" alt="likes"/>
                      <p>0</p>
                    </div>
                  </div>
                </li>
            );  
          }
          
        })}
      </ul>
    </div>
    
  );
}
