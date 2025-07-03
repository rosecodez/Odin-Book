import { useEffect, useState } from "react";
import DarkThemeBtn from "../assets/icons8-dark-theme-30.png";
import LightThemeBtn from "../assets/icons8-light-on-50.png";

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} className="btn btn-ghost btn-sm">
      <img
        src={isDark ? LightThemeBtn : DarkThemeBtn}
        alt="Toggle Theme"
        className="w-6 h-6"
      />
    </button>
  );
}