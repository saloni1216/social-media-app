import "./CreatePost.css";

import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageHelper";

import { FaImage, FaSmile, FaPaperPlane } from "react-icons/fa";

import { createPost } from "../../../services/postService";

function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);

  const textareaRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [feeling, setFeeling] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);

  const feelings = [
    "😊 Happy",
    "😍 Loved",
    "🥳 Excited",
    "😎 Cool",
    "🤩 Amazing",
    "😢 Sad",
    "😴 Sleepy",
    "🤒 Sick",
    "😡 Angry",
    "❤️ Blessed",
  ];

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFeeling = () => {
    setShowFeelings(!showFeelings);

    textareaRef.current?.focus();
  };

  const selectFeeling = (item) => {
    setFeeling(item);
    setShowFeelings(false);

    textareaRef.current?.focus();
  };

  const handlePost = async () => {
    if (!caption && !image && !feeling) {
      alert("Please add something.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "caption",
      feeling ? `${caption}\n\nFeeling ${feeling}` : caption,
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      await createPost(formData);

      setCaption("");
      setImage(null);
      setFeeling("");
      setShowFeelings(false);

      onPostCreated();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img src={getImageUrl(user?.profile_picture)} alt="profile" />

        <div style={{ flex: 1 }}>
          <textarea
            ref={textareaRef}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={`What's on your mind, ${
              user?.full_name?.split(" ")[0] || "User"
            }?`}
          />

          {feeling && (
            <p
              style={{
                color: "#8B5CF6",
                marginTop: "10px",
                fontWeight: "600",
              }}
            >
              {feeling}
            </p>
          )}

          {showFeelings && (
            <div className="feeling-list">
              {feelings.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectFeeling(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="preview-image"
            alt="preview"
          />
        )}
      </div>

      <div className="create-post-footer">
        <label className="button">
          <FaImage />
          Photo
          <input hidden type="file" accept="image/*" onChange={handleImage} />
        </label>

        <button type="button" onClick={handleFeeling}>
          <FaSmile />
          Feeling
        </button>

        <button className="post-btn" onClick={handlePost}>
          <FaPaperPlane />
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
