import React, { useState, useEffect } from "react";

export default function AllUsers() {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        async function getAllUsers () {
            try {
                const response = await fetch("http://localhost:3000/users/all-users", {
                    credentials: 'include'
                });

                if (!response.ok) {
                    console.error();
                    return;
                }

                const data = await response.json();
                console.log(data)
                setAllUsers(data);
            }

            catch {
                console.error(error)
            }
        }
        getAllUsers ()
    }, [])

    return (
        <ul className="flex flex-col gap-2 justify-start justify-items-start items-start pl-[0px]">
            {allUsers.length > 0 ? (
                allUsers.map((user) => (
                    <a href={`/users/${user.username}`}>
                        <li key={user.id} className="flex gap-2">
                            <img src={user.profile_image} alt="profile image" className="w-[40px] h-[40px]"></img>
                            <p className="pt-[5px]">{user.username}</p>
                        </li>
                    </a>
                ))
            ) : (
                null
            )}
        </ul>
    );
}