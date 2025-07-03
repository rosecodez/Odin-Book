import ThemeToggleButton from "./ThemeToggleButton";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row justify-center items-center gap-4 pt-4">
        <a href="/">About</a>
        <a href="/">Terms</a>
        <a href="/">Privacy Policy</a>
        <a href="/">Contact</a>
        <ThemeToggleButton/>
      </div>

      <p className="text-[12px] pt-[50px]">rosecodez @ The Odin Project 2024</p>
      <p className="text-[12px] ">All rights reserved</p>
    </div>
    
    
  );
}
