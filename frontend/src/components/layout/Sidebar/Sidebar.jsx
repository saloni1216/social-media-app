import "./Sidebar.css";

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

    return (

        <aside className="sidebar">

            <div className="profile-card">

                <img
                    src="https://i.pravatar.cc/150?img=47"
                    alt="profile"
                />

                <h3>Saloni Singh</h3>

                <span>View Profile</span>

            </div>

            <div className="sidebar-menu">

                <button className="active">
                    <FaHome />
                    Home
                </button>

                <button>
                    <FaUser />
                    Profile
                </button>

                <button>
                    <FaComments />
                    Chat
                </button>

                <button>
                    <FaBookmark />
                    Saved
                </button>

                <button>
                    <FaBell />
                    Notifications
                </button>

                <button>
                    <FaCog />
                    Settings
                </button>

            </div>

            <button className="logout-btn">

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

}

export default Sidebar;