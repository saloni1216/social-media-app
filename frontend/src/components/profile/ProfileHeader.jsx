import "./ProfileHeader.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditProfileModal from "./EditProfileModal";
import { getImageUrl } from "../../utils/imageHelper";

function ProfileHeader() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-header">

      {/* Cover Photo */}
      <div className="profile-cover">
        <img
          src={getImageUrl(user?.cover_photo)}
          alt="Cover"
        />
      </div>


      {/* Profile Info */}
      <div className="profile-info">

        <div className="profile-image">
          <img
            src={getImageUrl(user?.profile_picture)}
            alt="Profile"
          />
        </div>


        <div className="profile-details">

          <h2>
            {user?.full_name}
          </h2>

          <span>
            @{user?.username}
          </span>

          <p>
            {user?.bio || "No bio added yet."}
          </p>


          <button onClick={() => setShowModal(true)}>
            Edit Profile
          </button>

        </div>

      </div>


      {
        showModal &&
        <EditProfileModal
          onClose={() => setShowModal(false)}
        />
      }

    </div>
  );
}

export default ProfileHeader;