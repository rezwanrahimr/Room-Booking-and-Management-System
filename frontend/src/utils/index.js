import Cookies from "js-cookie";

export const authHeader = (isFormData = false) => {
    const token = Cookies.get('token');

    if (token) {
        const headers = {
            Authorization: "Bearer " + token,
        };

       
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    }

    return {};
};
