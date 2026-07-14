import "./Profile.css";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfilePosts from "../../components/profile/ProfilePosts";

function Profile() {
  return (
    <>
      <Navbar />

      <div className="profile-page-layout">
        <Sidebar />

        <main className="profile-content">

          <ProfileHeader />

          <ProfileStats />

          <ProfileTabs />

          <ProfilePosts />

        </main>
      </div>
    </>
  );
}

export default Profile;