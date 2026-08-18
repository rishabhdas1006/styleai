import axios from "axios";

import type { AxiosError } from "axios";


const axiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "/api/v1",

    headers: {
        "Content-Type": "application/json",
    },
});


// Attach JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Handle 401 globally - clear stale token only for non-auth endpoints
axiosInstance.interceptors.response.use(
    (response) => response,

    (error: AxiosError) => {
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/auth/")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
