const BASE_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image) => {
    if (!image) {
        return "/default-profile.png";
    }

    // Preview image
    if (image.startsWith("blob:")) {
        return image;
    }

    // Already a full URL
    if (image.startsWith("http")) {
        return image;
    }

    return `${BASE_URL}${image}`;
};