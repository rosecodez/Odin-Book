import React, { useEffect } from "react";
import API_URL from "../config";
import { HeaderProps } from "../types";
import { useNavigate, Link } from "react-router-dom";


const Header: React.FC<HeaderProps> = ({
    isVisitor,
    setIsVisitor,
    isAuthenticated,
    setIsAuthenticated,
  }) => {
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      console.log("Logout successful!");
      setIsAuthenticated(false);
      setIsVisitor(false);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
    navigate("/");
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
          setIsAuthenticated(true);
          setIsVisitor(data.user.isVisitor || false);
        } else {
          setIsAuthenticated(false);
          setIsVisitor(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="flex flex-row justify-between pb-[40px] text-xl ">
      <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
        <Link to="/" className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary hover:text-secondary transition-transform duration-200 no-underline hover:scale-105" >
          Odin<span className="text-base-content">Book</span>
        </Link>

      </div>

      
      {isAuthenticated ? (
        <div
          id="header-left-panel"
          className="flex gap-6 font-medium flex-wrap"
        >
          {!isVisitor && (
            <Link
              to ="/profile"
              className="text-base-content no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
            >
              Profile
            </Link>
          )}
          <Link to="/"
            onClick={handleLogout}
            className="text-base-content no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
          >
            Log out
          </Link>
        </div>
      ) : (
        <div
          id="header-right-panel"
          className="flex gap-6 font-medium flex-wrap"
        >
          <a
            href="/login"
            className="text-base-content no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8"
          >
            Login
          </a>
        </div>
      )}
    </header>
  );
}

export default Header;