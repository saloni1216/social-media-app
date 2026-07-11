import "./CreatePost.css";
import { FaImage, FaSmile, FaPaperPlane } from "react-icons/fa";

function CreatePost() {

    return (

        <div className="create-post">

            <div className="create-post-header">

                <img
                    src="https://i.pravatar.cc/150?img=47"
                    alt="profile"
                />

                <textarea
                    placeholder="What's on your mind, Saloni?"
                ></textarea>

            </div>

            <div className="create-post-footer">

                <button>

                    <FaImage />

                    Photo

                </button>

                <button>

                    <FaSmile />

                    Feeling

                </button>

                <button className="post-btn">

                    <FaPaperPlane />

                    Post

                </button>

            </div>

        </div>

    );

}

export default CreatePost;