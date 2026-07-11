import "./Home.css";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import RightSidebar from "../../components/layout/RightSidebar/RightSidebar";
import CreatePost from "../../components/post/CreatePost/CreatePost";
import PostCard from "../../components/post/PostCard/PostCard";
import StorySection from "../../components/story/StorySection/StorySection";
import dummyPosts from "../../utils/dummyPosts";

function Home() {
  return (
    <>
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="feed">
          <StorySection />
          <CreatePost />
          {dummyPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
        <RightSidebar />
      </div>
    </>
  );
}

export default Home;
