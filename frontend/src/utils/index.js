import Cookies from "js-cookie";

export const authHeader = () => {
    const token = Cookies.get('token');

    if (token) {
        return {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
    }

    return {};
};