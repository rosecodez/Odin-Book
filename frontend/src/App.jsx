import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import HomePage from "./pages/homePage";
import Header from "./components/header";
import Footer from "./components/footer";
import ProfilePage from "./pages/profilePage";
import SignupPage from "./pages/singupPage";
import LoginPage from "./pages/loginPage";
import FeedPage from "./pages/feedPage";
import PostDetailsPage from "./pages/postDetailsPage";
import UserDetailsPage from "./pages/userDetailsPage";
import AllUsers from "./components/allUsers";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

function App() {
  const [isVisitor, setIsVisitor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/check-authentication`, {
          credentials: "include",
        });
        
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated || false);
        setUsername(data.user.username);
        setIsVisitor(data.user?.isVisitor || false);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Header
        isVisitor={isVisitor}
        setIsVisitor={setIsVisitor}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="flex flex-row min-h-[41rem] justify-center">
        {isAuthenticated && <AllUsers />}
        <Routes>
          <Route
            path="/"
            element={
              isVisitor ? (
                <FeedPage
                  isAuthenticated={isAuthenticated}
                  isVisitor={isVisitor}
                  setIsVisitor={setIsVisitor}
                />
              ) : (
                <HomePage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage isVisitor={isVisitor} setIsVisitor={setIsVisitor} />
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/logout"
            element={
              <HomePage
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/posts/:postId"
            element={<PostDetailsPage username={username} />}
          />
          <Route
            path="/users/:username"
            element={<UserDetailsPage username={username} />}
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
