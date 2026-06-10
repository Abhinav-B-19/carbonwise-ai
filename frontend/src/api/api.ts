import axios from "axios";

const api = axios.create({
  baseURL:
    "https://carbonwise-ai-44hh.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userKey =
      localStorage.getItem(
        "carbonwise_userKey"
      );

    if (userKey) {
      config.headers[
        "X-User-Key"
      ] = userKey;
    }

    return config;
  }
);

export default api;