import axios from "axios";

const baseURLHolder =
  import.meta.env.VITE_ENV === "development" // Use Vite's `import.meta.env`
    ? import.meta.env.VITE_DEV_API_BASE_URL
    : import.meta.env.VITE_PROD_API_BASE_URL;

const api = axios.create({
  baseURL: baseURLHolder,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error("Error response:", error.response);
//     } else if (error.request) {
//       // No response was received
//       console.error("Error request:", error.request);
//     } else {
//       // Something else triggered the error
//       console.error("Error message:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
