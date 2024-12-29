import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { config } from '../config/index';
import axios from 'axios';
const AuthPage = ({ type = 'signin' }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
      username: formData.username,
      password: formData.password,
    });
    try {
      if (type === 'signin') {
        const res = await axios.post(
          `${config.BACKEND_URL}/user/signin`,
          formData
        );
        console.log(res);
        if (!res.data.success) {
          setErrorMessage(res.data?.message);
        } else {
          navigate('/signin');
        }
      } else if (type === 'signup') {
        const res = await axios.post(`${config.BACKEND_URL}/user/signup`, {
          username: formData.username,
          password: formData.password,
        });
        if (!res.data.success) {
          setErrorMessage(res.data?.message);
        } else {
          localStorage.setItem('token', res.data?.token);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl" />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {type === 'signin' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-gray-400">
            {type === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Enter your information to create your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>
          <p>{errorMessage}</p>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400">
          {type === 'signin' ? (
            <>
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-purple-500 hover:text-purple-400"
              >
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                href="/signin"
                className="text-purple-500 hover:text-purple-400"
              >
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

const SignIn = () => <AuthPage type="signin" />;
const SignUp = () => <AuthPage type="signup" />;

export { SignIn, SignUp };
