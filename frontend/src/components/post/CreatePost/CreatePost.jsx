import "./CreatePost.css";

import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageHelper";

import { FaImage, FaSmile, FaPaperPlane } from "react-icons/fa";

import { createPost } from "../../../services/postService";

function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [feeling, setFeeling] = useState("");

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFeeling = () => {
    const feel = prompt("How are you feeling?");

    if (feel) setFeeling(feel);
  };

  const handlePost = async () => {
    if (!caption && !image && !feeling) {
      alert("Please add something.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "caption",
      `${caption}${feeling ? ` Feeling ${feeling}` : ""}`
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      await createPost(formData);

      setCaption("");
      setImage(null);
      setFeeling("");

      onPostCreated();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img
          src={getImageUrl(user?.profile_picture)}
          alt="profile"
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={`What's on your mind, ${
            user?.full_name?.split(" ")[0] || "User"
          }?`}
        />

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
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </label>

        <button onClick={handleFeeling}>
          <FaSmile />
          Feeling
        </button>

        <button
          className="post-btn"
          onClick={handlePost}
        >
          <FaPaperPlane />
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;