import "./ProfileDropdown.css";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

function ProfileDropdown() {
    return (
        <div className="profile-dropdown">

            <div className="dropdown-header">

                <img
                    src="https://i.pravatar.cc/150?img=47"
                    alt="profile"
                />

                <div>
                    <h4>Saloni Singh</h4>
                    <span>saloni@gmail.com</span>
                </div>

            </div>

            <button>
                <FaUser />
                My Profile
            </button>

            <button>
                <FaCog />
                Settings
            </button>

            <button className="logout">
                <FaSignOutAlt />
                Logout
            </button>

        </div>
    );
}

export default ProfileDropdown;