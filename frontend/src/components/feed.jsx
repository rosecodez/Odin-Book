import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import camera from "../assets/camera.png";

export default function Feed() {
    const [image, setImage] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();


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
            setImage(data.user.profile_image);
            console.log("Profile data:", data);
          })
          .catch(error => {
            console.error("Error fetching profile data:", error);
          });
    
    }, [navigate]);
    
    return (
        <div className="flex flex-row gap-6">
            <img src={image} className="rounded-full w-[70px] h-[70px]" />
            <form className="flex flex-col" method="POST" encType="multipart/form-data" action="/new-post">
                <div className="flex flex-row gap-2">
                    <textarea name="text">What is happening?</textarea>
                </div>

                <div className="flex flex-row gap-2 items-center justify-between">
                    <img src={camera} alt="camera" className="w-10 h-10 cursor-pointer bg-white p-1"/>
                    <button type="submit" className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-2 rounded focus:outline-none focus:shadow-outline">Post</button>
                </div>
            </form>
        </div>
    )
}