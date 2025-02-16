import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

export default function Header({
  isVisitor,
  setIsVisitor,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Logout request failed");
      }
      document.cookie =
      "connect.sid=; path=/; domain=.odin-book-frontend.onrender.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly; SameSite=None";
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${API_URL}/check-authentication`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        console.log(data)
        if (data.isAuthenticated) {
          console.log(data)
          setIsAuthenticated(true);
          setIsVisitor(data.user.isVisitor || false);
        } else {
          console.log(data)
          setIsAuthenticated(false);
          setIsVisitor(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  return (
    <header className="flex flex-row justify-between pb-[40px] text-xl ">
      <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
        <a href="/">
          <p>Odin book</p>
        </a>
      </div>

      {isAuthenticated ? (
        <div
          id="header-left-panel"
          className="flex gap-6 font-medium flex-wrap"
        >
          {!isVisitor && (
            <a
              href="/profile"
              className="text-black no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
            >
              Profile
            </a>
          )}
          <a
            href="/logout"
            onClick={handleLogout}
            className="text-black no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
          >
            Log out
          </a>
        </div>
      ) : (
        <div
          id="header-right-panel"
          className="flex gap-6 font-medium flex-wrap"
        >
          <a
            href="/login"
            className="text-black no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
          >
            Login
          </a>
        </div>
      )}
    </header>
  );
}
