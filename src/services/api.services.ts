import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "//get-safety-api.vercel.app/api",
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
