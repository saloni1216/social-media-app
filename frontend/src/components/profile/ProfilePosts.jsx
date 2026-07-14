import "./ProfilePosts.css";

const posts = [
  {
    id: 1,
    image: "https://picsum.photos/500/500?random=1",
  },
  {
    id: 2,
    image: "https://picsum.photos/500/500?random=2",
  },
  {
    id: 3,
    image: "https://picsum.photos/500/500?random=3",
  },
  {
    id: 4,
    image: "https://picsum.photos/500/500?random=4",
  },
  {
    id: 5,
    image: "https://picsum.photos/500/500?random=5",
  },
  {
    id: 6,
    image: "https://picsum.photos/500/500?random=6",
  },
];

function ProfilePosts() {
  return (
    <div className="profile-posts">

      {posts.map((post) => (
        <div className="post-item" key={post.id}>
          <img
            src={post.image}
            alt="post"
          />
        </div>
      ))}

    </div>
  );
}

export default ProfilePosts;