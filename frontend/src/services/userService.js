import api from "../api/axios";

export const getProfile = () => {
    return api.get("accounts/profile/");
};