import "./Sidebar.css";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";
import { logoutUser } from "../../../services/authService";
import { getImageUrl } from "../../../utils/imageHelper";

import {
  FaHome,
  FaUser,
  FaComments,
  FaBookmark,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);
  const profileImage = getImageUrl(user?.profile_picture);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setUser(null);

      navigate("/login");
    }
  };

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <img src={profileImage} alt="profile" />

        <h3>{user?.full_name || "User"}</h3>

        <NavLink to="/profile" className="view-profile">
          View Profile
        </NavLink>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/home" end>
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/profile">
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/chat">
          <FaComments />
          <span>Chat</span>
        </NavLink>

        <NavLink to="/saved">
          <FaBookmark />
          <span>Saved</span>
        </NavLink>

        <NavLink to="/notifications">
          <FaBell />
          <span>Notifications</span>
        </NavLink>

        <NavLink to="/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
