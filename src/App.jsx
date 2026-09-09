import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import SongPlayer from "./pages/SongPlayer";
import BrowserHistory from "./pages/BrowserHistory";
import "./App.css";

export default function App() {
  return (
    <HashRouter>
      <div className="layout">
        <aside className="sidebar">
          <p className="sidebar__title">Challenge 03</p>

          <nav className="sidebar__nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
              }
            >
              Reproductor
            </NavLink>
            <NavLink
              to="/historial"
              className={({ isActive }) =>
                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
              }
            >
              Historial
            </NavLink>
          </nav>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<SongPlayer />} />
            <Route path="/historial" element={<BrowserHistory />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
