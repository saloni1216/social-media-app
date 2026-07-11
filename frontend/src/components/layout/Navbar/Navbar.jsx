import "./Navbar.css";
import { useState } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

import { FaHome, FaBell, FaComments, FaSearch } from "react-icons/fa";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Socialize</h2>
      </div>

      <div className="navbar-search">
        <FaSearch className="search-icon" />

        <input type="text" placeholder="Search people, posts..." />
      </div>

      <div className="navbar-icons">
        <button>
          <FaHome />
        </button>

        <button>
          <FaComments />
        </button>

        <button className="notification-btn">
          <FaBell />

          <span>3</span>
        </button>

        <div
          className="profile-avatar"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          S
        </div>

        {showDropdown && <ProfileDropdown />}
      </div>
    </nav>
  );
}

export default Navbar;
