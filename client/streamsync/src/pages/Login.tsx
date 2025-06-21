import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Tv, ArrowRight, Smartphone } from 'lucide-react';
import { useAuthToken } from "../hooks/useAuthToken";
import api from '@/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setToken } = useAuthToken();
  const  navigate  = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Login data:', formData);
    try {
      const res = await api.post("/auth/login", {
          username: formData.username,
          password: formData.password,
        }
      );
      const token = res.data.token;
      setToken(token); // sets cookie
      navigate("/room");
      console.log("✅ Login successful:", res);
      alert(`Login successful! ${res}`);
      document.location.href = "/room"; // Redirect to login page after successful registration
      // You can redirect or show a success message here
    } catch (error: any) {
      console.error(
        "❌ Login error:",
        error.response?.data || error.message
      );
      alert(
        "Login failed. " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">StreamSync</h1>
          <p className="text-slate-400">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    focusedField === 'username' 
                      ? 'border-blue-500 focus:ring-blue-500/20 bg-slate-700/80' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    focusedField === 'password' 
                      ? 'border-blue-500 focus:ring-blue-500/20 bg-slate-700/80' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="text-slate-300 text-sm">
                  Remember me
                </label>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-4 text-slate-400 text-sm">or</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors" onClick={() => document.location.href = '/register'}>
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Need help? Visit our{' '}
            <button className="text-slate-400 hover:text-slate-300 underline transition-colors">
              Support Center
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;