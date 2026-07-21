import "./ProfileDropdown.css";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/imageHelper";

function ProfileDropdown({ onLogout }) {

  const { user } = useContext(AuthContext);

  return (
    <div className="profile-dropdown">

      {/* Header */}
      <div className="dropdown-header">

        <img
          src={getImageUrl(user?.profile_picture)}
          alt="profile"
        />

        <div>
          <h4>
            {user?.full_name || "User"}
          </h4>

          <span>
            {user?.email || "user@gmail.com"}
          </span>
        </div>

      </div>


      {/* Profile */}
      <Link 
        to="/profile" 
        className="dropdown-item"
      >
        <FaUser />
        <span>Profile</span>
      </Link>


      {/* Settings */}
      <Link 
        to="/settings" 
        className="dropdown-item"
      >
        <FaCog />
        <span>Settings</span>
      </Link>


      {/* Logout */}
      <button 
        onClick={onLogout} 
        className="dropdown-item logout"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>


    </div>
  );
}

export default ProfileDropdown;