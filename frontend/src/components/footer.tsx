import ThemeToggleButton from "./ThemeToggleButton";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer  className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row justify-center items-center gap-8 pt-10">
        <Link to="/about" className="no-underline">About</Link>
        <Link to="/terms" className="no-underline">Terms</Link>
        <Link to="/privacy-policy" className="no-underline">Privacy Policy</Link>
        <a href="https://rosecodez.github.io/Portfolio-Website/" className="no-underline">Contact</a>
        <ThemeToggleButton/>
      </div>

      <p className="text-[12px] pt-[15px]">Roxana Dandu @ The Odin Project 2024</p>
    </footer >
    
  );
}

export default Footer;