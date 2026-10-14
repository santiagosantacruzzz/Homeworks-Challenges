export default function TopBar() {
  return (
    <header className="topbar">
      <svg
        className="topbar__logo"
        viewBox="0 0 24 28"
        role="img"
        aria-label="Book Stack"
      >
        <path d="M2 3a3 3 0 0 1 3-3h17v21H5a3 3 0 0 0-3 3z" />
        <path d="M2 24a3 3 0 0 1 3-3h17v2.4H5.3a1 1 0 0 0 0 2H22V28H5a3 3 0 0 1-3-3z" />
        <text x="12.5" y="14.5" textAnchor="middle">
          L
        </text>
      </svg>

      <div className="topbar__avatar" aria-label="User profile" role="img">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="4.2" />
          <path d="M3.8 21.5c.9-4.2 4.2-6.6 8.2-6.6s7.3 2.4 8.2 6.6z" />
        </svg>
      </div>
    </header>
  );
}
