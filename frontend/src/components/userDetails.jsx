import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
export default function UserDetails () {
    const { userId } = useParams();
    const [user, setUser]= useState("");
    const { username } = useParams();
    console.log("userId param:", userId);
    
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${username}`, { 
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error(`error fetching user details`);
                }
                const data = await response.json();
                console.log("get user details", data);
                setUser(data);

            } catch (error) {
                console.error("error fetching user", error);
            }
        };
        console.log(userId, "userId params")
        getUserDetails();
    }, [userId]);


    return (
        <div className="flex flex-col">
            {user ? (
                <>
                    <h1>{user.username}</h1>
                    <p>{user.bio}</p>
                    <img src={user.profile_image} alt={`${user.username}'s profile`} />
                </>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
    
}