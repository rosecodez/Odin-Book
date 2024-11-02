import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/homePage';
import Header from './components/header';
import Footer from './components/footer';
import ProfilePage from './pages/profilePage';
import SignupPage from './pages/singupPage';
function App() {
  return (
    <Router>
      <Header/>
      <div className="flex flex-col min-h-[41rem]">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/sign-up" element={<SignupPage/>}/>
        </Routes>
      </div>

      <Footer/>
    </Router>
  )
}

export default App
