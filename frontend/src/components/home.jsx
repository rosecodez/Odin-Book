import { useEffect } from "react";
import Feed from "./feed";

export default function Home({ isAuthenticated, setIsAuthenticated }) {
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch("http://localhost:3000/check-authentication", {
              credentials: "include",
            });
            const data = await response.json();
            console.log("Auth Data:", data);
            
            if (data.isAuthenticated) {
              console.log("data is authenticated true")
              setIsAuthenticated(true);
              console.log(isAuthenticated);
            } else {
              console.log("data is authenticated false")
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
          }
        };
    
        checkAuth();
      }, [isAuthenticated, setIsAuthenticated]);
    

    return (
        <div>
          {isAuthenticated ? (
            <Feed isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            
            ) : (
              <>
                <p>Welcome to Odin Book</p>
                <a href="/signup" className="text-[#6b7280]">Sign up today!</a>
              </>
            )
          }
        </div>
    )
}