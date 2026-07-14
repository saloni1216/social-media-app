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
      <div className="dropdown-header">
   <img
 src={getImageUrl(user?.profile_picture)}
 alt="profile"
/>

        <div>
          <h4>{user?.full_name || "User"}</h4>

          <span>{user?.email || "user@gmail.com"}</span>
        </div>
      </div>

      <button onClick={onLogout} className="logout">
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default ProfileDropdown;
