import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fraunces/600";
import "@fontsource/fraunces/900";
import "@fontsource/fraunces/600-italic";
import "@fontsource/space-mono/400";
import "@fontsource/space-mono/700";
import "./styles/app.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
