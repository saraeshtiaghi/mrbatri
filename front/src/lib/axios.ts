import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Create a configured Axios instance
export const apiClient = axios.create({
    baseURL: '/api', // Points to your Next.js routes (which then proxy to Spring)
    headers: {
        'Content-Type': 'application/json',
    },
});

// The Interceptor: Runs before EVERY request
apiClient.interceptors.request.use(
    (config) => {
        // Grab the token directly from your Zustand store!
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);