import "./EditProfileModal.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/imageHelper";
import api from "../../api/api"; // ⚠️ ye path apne project ke hisaab se check/adjust kar lena

function EditProfileModal({ onClose }) {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [profilePreview, setProfilePreview] = useState(user?.profile_picture);
  const [coverPreview, setCoverPreview] = useState(user?.cover_photo);

  // Profile Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // Cover Image Preview
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("full_name", formData.full_name);
    data.append("bio", formData.bio);

    if (profileFile) {
      data.append("profile_picture", profileFile);
    }
    if (coverFile) {
      data.append("cover_photo", coverFile);
    }

    try {
      // Shared `api` instance use kar rahe hain (interceptor token khud add karta hai)
      // Isme leading slash NAHI lagani, warna baseURL ke trailing slash ke saath
      // double slash (//) ban jayega aur Django 404 dega.
      const response = await api.patch("accounts/update/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile Updated:", response.data);

      // Update globally
      const updatedUser = {
        ...user,
        ...response.data,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data));

      alert("Profile Updated Successfully");
      onClose();
    } catch (error) {
      console.log(error.response?.data);
      alert("Profile Update Failed");
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="profile-upload">
            <img
              src={
                profilePreview
                  ? getImageUrl(profilePreview)
                  : "https://via.placeholder.com/120"
              }
              alt="Profile"
              className="preview-image"
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <hr />

          <label>Cover Photo</label>

          <div className="cover-upload">
            <img
              src={
                coverPreview
                  ? getImageUrl(coverPreview)
                  : "https://via.placeholder.com/1200"
              }
              alt="Cover"
              className="cover-preview"
            />

            <input type="file" accept="image/*" onChange={handleCoverChange} />
          </div>

          <label>Full Name</label>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <label>Username</label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Bio</label>

          <textarea
            rows="4"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
