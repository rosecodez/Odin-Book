import ThemeToggleButton from "./ThemeToggleButton";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row justify-center items-center gap-8 pt-10">
        <a href="/about" className="no-underline">About</a>
        <a href="/terms" className="no-underline">Terms</a>
        <a href="/privacy-policy" className="no-underline">Privacy Policy</a>
        <a href="https://rosecodez.github.io/Portfolio-Website/" className="no-underline">Contact</a>
        <ThemeToggleButton/>
      </div>

      <p className="text-[12px] pt-[15px]">Roxana Dandu @ The Odin Project 2024</p>
    </div>
    
  );
}
