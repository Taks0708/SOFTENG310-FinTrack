import axios from "axios";

const token = localStorage.getItem("token");

export default function getAxiosInstance() {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    return axios.create({
        baseURL: "http://localhost:4000",
        headers: { Authorization: `Bearer ${token}` },
    });
}
