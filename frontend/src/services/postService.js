import api from "../api/axios";

export const getPosts = () => {
  return api.get("posts/");
};

export const createPost = (formData) => {
  return api.post("posts/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};