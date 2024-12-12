import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Posts from "../components/posts"
import { useNavigate } from "react-router-dom";

export default function UserDetails () {
    const navigate = useNavigate();
    const [user, setUser]= useState("");
    const { username } = useParams();
    const [loggedInUser, setLoggedInUser] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:3000/check-authentication", {
                credentials: "include",
            });
            const data = await response.json();
            // if user details username is the same as authenticated user, go directly to authenticated profile

            if(username === data.user.username) {
                navigate("/profile");
            }
            setLoggedInUser(data.user)
            console.log(data)
        } catch (error) {
            console.error("Error checking authentication:", error);
        }
        };

        checkAuth();
    }, []);
    
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
        console.log(username, "userId params")
        getUserDetails();
    }, [username]);


    return (
        <div className="flew flex-col w-[800px] max-w-[800px] text-left">
            <div className="flex flex-row gap-[40px] pb-[10px] w-full">
                <div className=" w-[150px] h-[160px]">
                    <img src={user.profile_image} className="outline outline-offset-2 outline-gray-500 rounded-full w-[150px] h-[160px]" />
                </div>

                <div className="h-[160px]">
                    <h2 className="text-2xl bold pt-8">{username}</h2>
                    <p>{user.bio}</p>
                    <a href="">Follow user</a>
                </div>
                
            </div>
            
            <Posts userId={user.id} loggedInUserId={loggedInUser.id} />

        </div>
    )
}