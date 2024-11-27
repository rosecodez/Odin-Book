import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from 'react-hook-form';
import camera from "../assets/camera.png";
import Posts from "./posts";
import NewPost from "./newPost";

export default function Profile({ isVisitor, setIsVisitor }) {
  const { register, handleSubmit } = useForm();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  
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
  

  return (
    <div className="flew flex-col w-[800px] max-w-[800px] text-left">
      <div className="flex gap-3">
        <img src={image} className="rounded-full w-[70px] h-[70px]" />

        <NewPost isVisitor={isVisitor} setIsVisitor={setIsVisitor}/>
      </div>

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
      <Posts/>
    </div>
    
  );
}
