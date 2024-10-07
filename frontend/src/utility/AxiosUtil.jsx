import axios from "axios";

const token = localStorage.getItem("token");

export default function getAxiosInstance() {
  return axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` }
  });
}