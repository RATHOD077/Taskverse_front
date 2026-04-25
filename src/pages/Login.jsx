// src/pages/Login.jsx - Employee / User Login
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/users/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-[#111827]">
      
      {/* Main Card Container */}
      <div className="relative w-full max-w-[460px]">
        
        {/* Top Left Green Accent (Matching the Admin theme) */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-[3px] border-l-[3px] border-[#10b981] rounded-tl-md"></div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-8 py-10 md:px-12 md:py-14">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Log in to your account</h1>
            <div className="w-10 h-[2px] bg-[#10b981]/30 mx-auto mt-2 mb-4"></div>
            <p className="text-slate-500 text-[15px]">Employee Portal - Sign in to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-5 border border-red-100">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 border border-[#10b981] rounded-lg focus:ring-4 focus:ring-emerald-50 focus:outline-none transition-all text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button 
                  type="button"
                  className="text-[#10b981] text-sm hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-[#10b981] focus:ring-4 focus:ring-emerald-50 focus:outline-none transition-all text-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.412 8.082 7.12 5 12 5c4.88 0 8.588 3.082 9.964 6.678.04.108.04.223 0 .332C20.588 15.918 16.88 19 12 19c-4.88 0-8.588-3.082-9.964-6.678Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 border-slate-300 rounded text-[#10b981] focus:ring-[#10b981] cursor-pointer"
              />
              <label htmlFor="remember" className="text-slate-600 text-sm cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#0da372] disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-lg text-base transition-all shadow-sm active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
