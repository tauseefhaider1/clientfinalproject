import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-final-project1-production.up.railway.app/",
  withCredentials: true,
});

export default api;
