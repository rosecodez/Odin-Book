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

            if (data.isAuthenticated) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
          }
        };
    
        checkAuth();
      }, [isAuthenticated, setIsAuthenticated]);
    

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 text-left shadow-md p-4">
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