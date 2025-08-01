import React from "react";
import Home from "../components/home";
import { HomePageProps } from "../types";

const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  isVisitor,
  setIsVisitor,
}) => {
  return (
    <Home
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      isVisitor={isVisitor}
      setIsVisitor={setIsVisitor}
    />
  );
};

export default HomePage;