import { useEffect } from "react";
import Feed from "./feed";
import API_URL from "../config";
import Connect from "./connect";
import AppScreenshot from "./appScreenshot"
export default function Home({ isAuthenticated, setIsAuthenticated }) {
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
        <Feed
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      ) : (
        <div className="flex justify-center items-center">
          <AppScreenshot/>
          <Connect />
        </div>
        
      )}
    </div>
  );
}
