// // import axios from 'axios';

// // const api = axios.create({
// //   baseURL: 'http://localhost:5000/api',
// //   withCredentials: true,  // To send cookies if your backend uses them
// // });

// // // Signup user
// // export const signup = (data) => api.post('/auth/signup', data);

// // // Login user
// // export const login = (data) => api.post('/auth/login', data);

// // // Get dashboard data for user
// // export const getUserDashboard = () => api.get('/user/dashboard');

// // // Get dashboard data for admin
// // export const getAdminDashboard = () => api.get('/admin/dashboard');


// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,  // To send cookies if your backend uses them
// });

// // Signup user
// export const signup = (data) => api.post('/auth/signup', data);

// // Login user
// export const login = (data) => api.post('/auth/login', data);

// // ✅ Get user from token (used after login to fetch user details)
// export const getUserFromToken = () => api.get('/auth/me');

// // Get dashboard data for user
// export const getUserDashboard = () => api.get('/user/dashboard');

// // Get dashboard data for admin
// export const getAdminDashboard = () => api.get('/admin/dashboard');


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api',
  withCredentials: true, // still useful for cookie-based auth, if applicable
});

// Add a request interceptor to attach token from sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
export const signup = (data) => api.post('/auth/signup', data);

export const getUserFromToken = () => api.get('/auth/me');
export const getUserDashboard = () => api.get('/user/dashboard');
export const getAdminDashboard = () => api.get('/admin/dashboard');
