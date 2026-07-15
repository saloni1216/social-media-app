import api from "../api/axios";

export const loginUser = (data) => {
    return api.post("accounts/login/", data);
};

export const registerUser = (data) => {
    return api.post("accounts/register/", data);
};

export const logoutUser = (refresh) => {
    return api.post("accounts/logout/", {
        refresh,
    });
};

export const refreshToken = (refresh) => {
  return api.post(
    "accounts/token/refresh/",
    {
      refresh,
    },
    {
      skipAuthRefresh: true,
    }
  );
};