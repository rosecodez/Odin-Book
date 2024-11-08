import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/homePage';
import Header from './components/header';
import Footer from './components/footer';
import ProfilePage from './pages/profilePage';
import SignupPage from './pages/singupPage';
import LoginPage from './pages/loginPage';

function App() {
  return (
    <Router>
      <Header/>
      <div className="flex flex-row min-h-[41rem] justify-center">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path='/logout' element={<HomePage/>}/>
        </Routes>
      </div>

      <Footer/>
    </Router>
  )
}

export default App
