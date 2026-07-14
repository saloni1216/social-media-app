import "./ProfileTabs.css";
import { useState } from "react";

import { FaTh, FaBookmark, FaUserTag, FaVideo } from "react-icons/fa";

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="profile-tabs">

      <button
        className={activeTab === "posts" ? "active" : ""}
        onClick={() => setActiveTab("posts")}
      >
        <FaTh />
        Posts
      </button>

      <button
        className={activeTab === "reels" ? "active" : ""}
        onClick={() => setActiveTab("reels")}
      >
        <FaVideo />
        Reels
      </button>

      <button
        className={activeTab === "saved" ? "active" : ""}
        onClick={() => setActiveTab("saved")}
      >
        <FaBookmark />
        Saved
      </button>

      <button
        className={activeTab === "tagged" ? "active" : ""}
        onClick={() => setActiveTab("tagged")}
      >
        <FaUserTag />
        Tagged
      </button>

    </div>
  );
}

export default ProfileTabs;