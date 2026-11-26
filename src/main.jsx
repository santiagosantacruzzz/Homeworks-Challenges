import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/400.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/main.scss";
import App from "./App";
import { CatalogoProvider } from "./context/CatalogoProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CatalogoProvider>
      <App />
    </CatalogoProvider>
  </StrictMode>
);
