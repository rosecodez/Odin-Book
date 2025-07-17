import React, { useState, useEffect } from "react";
import API_URL from "../config";

export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await fetch(`${API_URL}/users/all-users`, {
          credentials: "include",
        });

        if (!response.ok) {
          console.error();
          return;
        }

        const data = await response.json();
        setAllUsers(data);
      } catch {
        console.error(error);
      }
    }
    getAllUsers();
  }, []);

  return (
    <ul className="flex flex-col gap-2 justify-start items-start pl-[0px] min-w-[136px]  hide-on-small mr-[50px]">
      {allUsers.length > 0
        ? allUsers.map((user) => (
          <a href={`/users/${user.username}`} className="no-underline text-base-content hover:underline">
            <li key={user.id} className="flex gap-[20px]">
              <img
                src={user.profile_image}
                alt="profile image"
                className="w-[40px] h-[40px]"
              ></img>
              <p className="pt-[5px]">{user.username}</p>
            </li>
          </a>
        ))
        : null}
    </ul>
  );
}
