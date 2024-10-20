import Cookies from "js-cookie";

export const authHeader = (isFormData = false) => {
    const token = Cookies.get('token');

    if (token) {
        const headers = {
            Authorization: "Bearer " + token,
        };

        // If it's not FormData, set Content-Type to JSON
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    }

    return {};
};
