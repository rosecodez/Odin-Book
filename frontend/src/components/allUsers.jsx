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
    <div>
      <p className="hide-on-small text-left text-base-content text-xl font-semibold border-b border-base-300 pb-2 mb-2">You may know</p>
      <div className=" overflow-y-auto max-h-[80vh]">
        <ul className="flex flex-col gap-2 justify-start items-start pl-[0px] min-w-[136px] mr-[50px]">
          {allUsers.length > 0
            ? allUsers.map((user) => (
              <a href={`/users/${user.username}`} className="no-underline text-base-content hover:underline">
                <li key={user.id} className="flex gap-[20px] w-[230px]">
                  <img
                    src={user.profile_image}
                    alt="profile image"
                    className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
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
