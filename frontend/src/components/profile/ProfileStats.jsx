import "./ProfileStats.css";

function ProfileStats() {
  return (
    <div className="profile-stats">

      <div className="stat-card">
        <h3>24</h3>
        <span>Posts</span>
      </div>

      <div className="stat-card">
        <h3>1.2K</h3>
        <span>Followers</span>
      </div>

      <div className="stat-card">
        <h3>356</h3>
        <span>Following</span>
      </div>

    </div>
  );
}

export default ProfileStats;