import { useEffect, useState } from "react";
import DarkThemeBtn from "../assets/dark-theme-btn.svg";
import LightThemeBtn from "../assets/light-theme-btn.svg";

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
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
