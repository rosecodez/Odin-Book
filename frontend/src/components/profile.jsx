import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
 
export default function Profile() {
  const { register, handleSubmit } = useForm();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
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
        setUsername(data.user.username);
        setImage(data.user.profile);
        console.log("Profile data:", data);
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
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
    <div className="flex flex-col gap-2">

      <h2 className="text-2xl bold border-b-4 border-b-grey-500">Your profile</h2>
      <h2 className="text-2xl bold pt-8">{username}</h2>
      
      <div>
        <img src={image} className="pb-3 w-[40px]"></img>
        <button id="updateProfileButton" onClick={showModal} className='mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center'>Update profile picture</button>

      {modalVisibility && (
        <div id="profileModal" className="pt-6">
        <form id="UpdateProfilePicture" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" method="POST" encType="multipart/form-data" action="">
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
      </div>

    </div>
  );
}
