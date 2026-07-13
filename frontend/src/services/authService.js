import api from "../api/axios";

export const loginUser = (data) => {
    return api.post("accounts/login/", data);
};

export const registerUser = (data) => {
    return api.post("accounts/register/", data);
};