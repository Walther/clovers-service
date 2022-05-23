import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

const currentTheme = localStorage.getItem("theme");
if (!currentTheme) {
  localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme", "light");
} else {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
