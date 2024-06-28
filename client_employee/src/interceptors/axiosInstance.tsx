import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: serverUrl
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        delete config.headers['Content-Type'];
        // if (config.method === 'post') {
        //     if (config.data instanceof FormData) {
        //         const formDataEntries: { [x: string]: FormDataEntryValue; }[] = [];
        //         config.data.forEach((value, key) => {
        //             formDataEntries.push({ [key]: value });
        //         });
        //         console.log('FormData Contents:', formDataEntries);
        //     } else {
        //         console.log('Request Config Data:', config.data); // Log the payload directly if it's not FormData
        //     }
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;