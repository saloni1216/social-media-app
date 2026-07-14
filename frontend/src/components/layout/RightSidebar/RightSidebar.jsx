import "./RightSidebar.css";

function RightSidebar() {
  const trending = [
    "#React",
    "#Django",
    "#JavaScript",
    "#Python",
    "#WebDevelopment",
  ];

  const friends = ["Aman", "Priya", "Vaibhav"];

  return (
    <aside className="right-sidebar">
      <div className="card">
        <h3>🔥 Trending</h3>

        {trending.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      <div className="card">
        <h3>👥 Suggested Friends</h3>

        {friends.map((friend, index) => (
          <div className="friend" key={index}>
            <div className="friend-info">
              <img src={getImageUrl(user?.profile_picture)} alt="Profile" />
              <span>{friend}</span>
            </div>

            <button>Follow</button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default RightSidebar;
