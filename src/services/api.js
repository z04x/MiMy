import axios from "axios";

export const BASE_URL = "https://chat.myownwebpage.net";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
