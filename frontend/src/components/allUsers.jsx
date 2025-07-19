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
    <div className="hide-on-small">
      <p className="text-left text-base-content text-xl font-semibold border-b border-base-300 pb-2 mb-2">You may know</p>
      <div className="overflow-y-auto max-h-[80vh] pr-2">
        <ul className="flex flex-col gap-2 justify-start items-start pl-0 min-w-[136px]">
          {allUsers.length > 0
            ? allUsers.map((user) => (
              <a key={user.id} href={`/users/${user.username}`} className="no-underline text-base-content w-full">
                <li className="flex gap-4 w-full">
                  <img
                    src={user.profile_image}
                    alt="profile image"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  ></img>
                  <p className="truncate pt-[5px]">{user.username}</p>
                </li>
              </a>
            ))
            : null}
        </ul>
      </div>
    </div>
  );
}
