import "./StorySection.css";

const stories = [
    {
        id: 1,
        name: "Your Story",
        image: "https://i.pravatar.cc/150?img=47",
        own: true,
    },
    {
        id: 2,
        name: "Priya",
        image: "https://i.pravatar.cc/150?img=32",
    },
    {
        id: 3,
        name: "Aman",
        image: "https://i.pravatar.cc/150?img=18",
    },
    {
        id: 4,
        name: "Vaibhav",
        image: "https://i.pravatar.cc/150?img=25",
    },
    {
        id: 5,
        name: "Neha",
        image: "https://i.pravatar.cc/150?img=12",
    },
    {
        id: 6,
        name: "Riya",
        image: "https://i.pravatar.cc/150?img=48",
    },
];

function StorySection() {
    return (
        <div className="stories">

            {stories.map((story) => (

                <div
                    className={`story-card ${story.own ? "own-story" : ""}`}
                    key={story.id}
                >

                    <img
                        src={story.image}
                        alt={story.name}
                    />

                    <p>{story.name}</p>

                </div>

            ))}

        </div>
    );
}

export default StorySection;