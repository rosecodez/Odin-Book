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
    const [isFollowing, setIsFollowing] = useState(false);

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
        } catch (error) {
            console.error("Error checking authentication:", error);
        }
        };

        checkAuth();
        // rerun code only when username or navigate changes
    }, [username, navigate]);
    
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
                setUser(data);
                setIsFollowing(data.isFollowing);
            } catch (error) {
                console.error("error fetching user", error);
            }
        };
        getUserDetails();
    }, [username]);


    const followUser = async() => {
        try {
            const response = await fetch(`http://localhost:3000/users/${username}/follow`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok) {
                throw new Error('failed to follow/unfollow user')
            }

            const data = await response.json();
            setIsFollowing(data.following);
            window.location.reload();
        } catch (error) {
            console.log("error following user")
        }
    }
    
    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 text-left shadow-md p-4">
            <div className="flex flex-row gap-[40px] pb-[10px] w-full">
                <div className=" w-[150px] h-[160px]">
                    <img src={user.profile_image} className="outline outline-offset-2 outline-gray-500 rounded-full w-[150px] h-[160px]" />
                </div>

                <div className="h-[160px]">
                    <h2 className="text-2xl bold pt-8">{username}</h2>
                    <p>{user.bio}</p>
                    {loggedInUser && loggedInUser.username !== username && (
                        <button className="mt-4 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 rounded focus:outline-none focus:shadow-outline self-center w-[150px]" onClick={followUser}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
                
            </div>
            
            <Posts userId={user.id} loggedInUserId={loggedInUser.id} />

        </div>
    )
}