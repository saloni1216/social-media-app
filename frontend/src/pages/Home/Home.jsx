import "./Home.css";

import { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import StorySection from "../../components/story/StorySection/StorySection";
import CreatePost from "../../components/post/CreatePost/CreatePost";
import PostCard from "../../components/post/PostCard/PostCard";

import { getPosts } from "../../services/postService";

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="home-layout">
        <Sidebar />

        <main className="feed">
          <StorySection />

          <CreatePost onPostCreated={fetchPosts} />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </main>
      </div>
    </>
  );
}

export default Home;