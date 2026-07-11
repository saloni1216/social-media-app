import "./PostCard.css";
import { useState } from "react";

import { FaHeart, FaRegComment, FaShare, FaEllipsisH } from "react-icons/fa";

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(["Awesome ❤️", "Beautiful Post 🔥"]);

  const addComment = () => {
    if (comment.trim() === "") return;
    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <img src="https://i.pravatar.cc/150?img=47" alt="user" />

          <div>
            <h4>{post.name}</h4>

            <span>{post.time}</span>
          </div>
        </div>

        <FaEllipsisH className="more-icon" />
      </div>

      <div className="post-content">
        <p>{post.caption}</p>

        <img src={post.image} alt="post" />
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={liked ? "liked" : ""}>
          <FaHeart />
          {likes} Likes
        </button>

        <button onClick={() => setShowComments(!showComments)}>
          <FaRegComment />
          Comment
        </button>

        <button>
          <FaShare />
          Share
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <h4 className="comment-title">Comments ({comments.length})</h4>

          <div className="comments-list">
            {comments.map((item, index) => (
              <div className="comment-item" key={index}>
                <img
                  src="https://i.pravatar.cc/100?img=47"
                  alt="user"
                  className="comment-avatar"
                />

                <div className="comment-content">
                  <h5>Saloni Singh</h5>

                  <p>{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-box">
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="user"
              className="comment-avatar-small"
            />

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />

            <button onClick={addComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
