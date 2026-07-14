export const getImageUrl = (image) => {

    if (!image) {
        return "/default-profile.png";
    }

    // Preview image (browser blob)
    if (image.startsWith("blob:")) {
        return image;
    }

    // Already complete URL
    if (image.startsWith("http")) {
        return image;
    }

    return `http://127.0.0.1:8000${image}`;
};