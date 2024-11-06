import { useState, useEffect } from "react";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    

    return (
        <div>
            
            <p>Welcome to Odin Book</p>
            <a href="/signup" className="text-[#6b7280]">Sign up today!</a>
        </div>
    )
}