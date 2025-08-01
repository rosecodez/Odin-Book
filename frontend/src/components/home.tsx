import React, { useEffect, useLayoutEffect } from "react";
import { animateOnScroll } from "../animations/scrollAnimation";
import Feed from "./feed";
import API_URL from "../config";
import Connect from "./connect";
import AppScreenshot from "./appScreenshot";
import { HomeProps } from "../types";

const Home: React.FC<HomeProps> = ({
    isAuthenticated,
    setIsAuthenticated,
    isVisitor,
    setIsVisitor,
  }) => {
  useLayoutEffect(() => {
    animateOnScroll();
  }, []);

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
    <div className="flex flex-col w-full mx-auto px-4 text-left shadow-md p-4 gap-4">
      {isAuthenticated ? (
        <Feed
          isVisitor={isVisitor}
          setIsVisitor={setIsVisitor}
        />
      ) : (
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 pb-12">
          <AppScreenshot />
          <Connect />
        </div>

        
      )}
    </div>
  );
}
export default Home;