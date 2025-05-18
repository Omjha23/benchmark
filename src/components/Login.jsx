


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login as loginApi, getUserFromToken } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import toast, { Toaster } from 'react-hot-toast';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       getUserFromToken()
//         .then((userRes) => {
//           login(userRes.data);
//           navigate('/dashboard');
//         })
//         .catch((err) => {
//           console.error('Error fetching user info from token:', err);
//         });
//     }
//   }, [login, navigate]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await loginApi(form);
//       sessionStorage.setItem('token', res.data.token);

//       const userRes = await getUserFromToken();
//       login(userRes.data);

//       setMessage('Logged in successfully!');
//       toast.success('Logged in successfully! Redirecting...');


//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 4000);
//     } catch (err) {
//       console.error('Login failed:', err);
//       setMessage('Login failed. Please try again.');
//       toast.error('Login failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-orange-100 px-4">
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Login to Your Account
//         </h2>

//         {message && (
//           <div
//             className={`text-center mb-4 p-2 rounded-lg ${message === 'Logged in successfully!'
//                 ? 'bg-green-100 text-green-600'
//                 : 'bg-red-100 text-red-600'
//               }`}
//           >
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
//             required
//             disabled={loading}
//           />
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
//             required
//             disabled={loading}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full text-white py-2 rounded-lg shadow ${loading
//                 ? 'bg-amber-300 cursor-not-allowed'
//                 : 'bg-amber-600 hover:bg-amber-700'
//               }`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-600 mt-4">
//           Don't have an account?{' '}
//           <span
//             className="text-amber-600 cursor-pointer hover:underline"
//             onClick={() => !loading && navigate('/signup')}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import toast, { Toaster } from 'react-hot-toast';

// const API_BASE_URL = 'http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       axios
//         .get(`${API_BASE_URL}/auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((res) => {
//           login(res.data);
//           navigate('/dashboard');
//         })
//         .catch((err) => {
//           console.error('Error fetching user info from token:', err);
//         });
//     }
//   }, [login, navigate]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(`${API_BASE_URL}/auth/login`, form);

//       const token = res.data.token;
//       sessionStorage.setItem('token', token);

//       const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       login(userRes.data);

//       setMessage('Logged in successfully!');
//       toast.success('Logged in successfully! Redirecting...');

//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 4000);
//     } catch (err) {
//       console.error('Login failed:', err);
//       setMessage('Login failed. Please try again.');
//       toast.error('Login failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-orange-100 px-4">
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Login to Your Account
//         </h2>

//         {message && (
//           <div
//             className={`text-center mb-4 p-2 rounded-lg ${message === 'Logged in successfully!'
//               ? 'bg-green-100 text-green-600'
//               : 'bg-red-100 text-red-600'
//               }`}
//           >
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
//             required
//             disabled={loading}
//           />
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
//             required
//             disabled={loading}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full text-white py-2 rounded-lg shadow ${loading
//               ? 'bg-amber-300 cursor-not-allowed'
//               : 'bg-amber-600 hover:bg-amber-700'
//               }`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-600 mt-4">
//           Don't have an account?{' '}
//           <span
//             className="text-amber-600 cursor-pointer hover:underline"
//             onClick={() => !loading && navigate('/signup')}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

//  const API_BASE_URL = 'http://localhost:5000/api';
 const API_BASE_URL = 'http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Login — backend sets token in cookie
     const res = await axios.post(`${API_BASE_URL}/auth/login`, form, {
  withCredentials: true, // Required to receive cookies
});

sessionStorage.setItem('token', res.data.token);
const token = sessionStorage.getItem('token');
console.log("Success login post",token);
      // Step 2: Get user info using cookie-based token
      const userRes = await axios.post(`${API_BASE_URL}/auth/me`, 
  { token } // send token in body
);

      // Step 3: Set user info in context and navigate
      login(userRes.data);
      setMessage('Logged in successfully!');
      toast.success('Logged in successfully! Redirecting...');

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Login failed:', err);
      setMessage('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login to Your Account
        </h2>

        {message && (
          <div
            className={`text-center mb-4 p-2 rounded-lg ${
              message === 'Logged in successfully!'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg shadow ${
              loading
                ? 'bg-amber-300 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <span
            className="text-amber-600 cursor-pointer hover:underline"
            onClick={() => !loading && navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
