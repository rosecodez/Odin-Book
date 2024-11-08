import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch("http://localhost:3000/users/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error("Logout request failed");
          }
          navigate("/login");
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch("http://localhost:3000/check-authentication", {
              credentials: "include",
            });
            const data = await response.json();
            console.log("Auth Data:", data);
            
            if (data.isAuthenticated) {
              setIsAuthenticated(true);
              console.log(isAuthenticated);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
          }
        };
    
        checkAuth();
      }, [isAuthenticated]);

    return(
    <header className="flex flex-row items-center justify-between pb-[40px] text-xl">
        <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
            <a href="/">
                <p>Odin book</p>
            </a>
        </div>

        {isAuthenticated  ? (
            <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
                <a href="/profile" className="text-black  decoration-2 decoration-sky-500 underline-offset-8">
                    Profile
                </a>
                <a href="/logout" onClick={handleLogout} className="text-black no-underline hover:underline decoration-2 decoration-sky-500 underline-offset-8">
                    Log out
                </a>
            </div>
        ) : (
            <div id="header-right-panel" className="flex gap-6 font-medium flex-wrap">
                <a href="/login" className="text-black  decoration-2 decoration-sky-500 underline-offset-8">
                    Login
                </a>

            </div>
        )
        }
        

    </header>
    )    
}