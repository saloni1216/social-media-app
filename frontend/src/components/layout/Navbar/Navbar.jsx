import "./Navbar.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaComments, FaSearch } from "react-icons/fa";

import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { logoutUser } from "../../../services/authService";
import { AuthContext } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageHelper";

function Navbar() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const currentUser = user || JSON.parse(localStorage.getItem("user"));

 const profileImage = getImageUrl(
  currentUser?.profile_picture
);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setUser(null);

      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}

      <div className="navbar-logo">
        <h2>Socialize</h2>
      </div>

      {/* Search */}

      <div className="navbar-search">
        <FaSearch className="search-icon" />

        <input type="text" placeholder="Search people, posts..." />
      </div>

      {/* Right Side */}

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
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="navbar-profile-image"
            />
          ) : (
            <span>
              {currentUser?.full_name?.charAt(0).toUpperCase() ||
                currentUser?.username?.charAt(0).toUpperCase() ||
                "S"}
            </span>
          )}
        </div>

        {showDropdown && (
          <ProfileDropdown user={currentUser} onLogout={handleLogout} />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
