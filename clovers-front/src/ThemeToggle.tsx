import React from "react";
import { Button } from "./Button";

export const ThemeToggle = () => {
  return <Button handleClick={toggleTheme} text="toggle theme" />;
};

const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
};
