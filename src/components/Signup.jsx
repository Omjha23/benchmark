

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/auth/register', form);
      console.log('Sign up successful:', res.data);

      setMessage('Signup successful! Redirecting to login...');
      toast.success('Signup successful! Redirecting...');

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Signup failed:', err);
      setMessage('Signup failed. Please try again.');
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create an Account</h2>

        {message && (
          <div
            className={`text-center mb-4 p-2 rounded-lg ${
              message.includes('successful')
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-lg shadow hover:bg-amber-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-amber-600 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
