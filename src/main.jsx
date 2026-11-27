import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/martian-mono/400";
import "@fontsource/martian-mono/600";
import "./styles/app.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
