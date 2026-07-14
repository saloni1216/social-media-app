import "./PostCard.css";

import { useState } from "react";
import {
  FaHeart,
  FaRegComment,
  FaShare,
  FaEllipsisH,
} from "react-icons/fa";

import { getImageUrl } from "../../../utils/imageHelper";

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);

  const [showComments, setShowComments] = useState(false);

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  const addComment = () => {
    if (comment.trim() === "") return;

    setComments([...comments, comment]);

    setComment("");
  };

  // Date Format
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Just now";

  return (
    <div className="post-card">
      {/* Header */}

      <div className="post-header">
        <div className="user-info">
          <img
            src={getImageUrl(post.user?.profile_picture)}
            alt="profile"
          />

          <div>
            <h4>{post.user?.full_name || "User"}</h4>

            <span>{formattedDate}</span>
          </div>
        </div>

        <FaEllipsisH className="more-icon" />
      </div>

      {/* Caption */}

      <div className="post-content">
        <p>{post.caption}</p>

        {post.image && (
          <img
            src={getImageUrl(post.image)}
            alt="post"
          />
        )}
      </div>

      {/* Actions */}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={liked ? "liked" : ""}
        >
          <FaHeart />
          {likes} Likes
        </button>

        <button
          onClick={() =>
            setShowComments(!showComments)
          }
        >
          <FaRegComment />
          Comment
        </button>

        <button>
          <FaShare />
          Share
        </button>
      </div>

      {/* Comments */}

      {showComments && (
        <div className="comments-section">
          <h4>Comments ({comments.length})</h4>

          {comments.map((item, index) => (
            <div
              key={index}
              className="comment-item"
            >
              {item}
            </div>
          ))}

          <div className="comment-box">
            <input
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write a comment..."
            />

            <button onClick={addComment}>
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;