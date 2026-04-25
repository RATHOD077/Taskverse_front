// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function AdminLogin() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: 'admin@gmail.com',
    password: ''
  });

  const [resetData, setResetData] = useState({
    email: 'admin@gmail.com',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  // Normal Login Logic (Untouched)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/admin/login', loginData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Logic (Untouched)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/admin/reset-password', {
        email: resetData.email,
        newPassword: resetData.newPassword
      });
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        setShowResetModal(false);
        setSuccess('');
        setResetData({ email: 'admin@gmail.com', newPassword: '' });
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-[1rem] font-sans selection:bg-emerald-100">
      
      {/* Responsive Container using rem */}
      <div className="relative w-full max-w-[25rem]">
        
        {/* Top Left Green Accent */}
        <div className="absolute -top-[0.25rem] -left-[0.25rem] w-[1.5rem] h-[1.5rem] border-t-[3px] border-l-[3px] border-[#10b981] rounded-tl-[0.375rem]"></div>

        <div className="bg-white rounded-[0.75rem] shadow-sm border border-slate-100 px-[1.75rem] py-[2.25rem] md:px-[2.25rem] md:py-[2.5rem]">
          
          {/* Header Section */}
          <div className="text-center mb-[1.5rem]">
            <h1 className="text-[1.5rem] font-bold text-slate-900 tracking-tight">Log in</h1>
            <div className="w-[2rem] h-[2px] bg-[#10b981]/30 mx-auto mt-[0.375rem] mb-[0.75rem]"></div>
            <p className="text-slate-500 text-[0.875rem]">Access your administrative dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-[0.625rem] rounded-[0.5rem] text-[0.7rem] mb-[1rem] border border-red-100">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-[1rem]">
            
            {/* Email Field */}
            <div>
              <label className="block text-[0.75rem] font-semibold text-slate-700 mb-[0.25rem]">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="admin@example.com"
                className="w-full px-[0.875rem] py-[0.5rem] border border-[#10b981] rounded-[0.5rem] focus:ring-4 focus:ring-emerald-50 focus:outline-none transition-all text-[0.875rem] placeholder:text-slate-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-[0.25rem]">
                <label className="text-[0.75rem] font-semibold text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[#10b981] text-[0.7rem] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-[0.875rem] py-[0.5rem] border border-slate-200 rounded-[0.5rem] focus:border-[#10b981] focus:ring-4 focus:ring-emerald-50 focus:outline-none transition-all text-[0.875rem]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1rem] h-[1rem]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.412 8.082 7.12 5 12 5c4.88 0 8.588 3.082 9.964 6.678.04.108.04.223 0 .332C20.588 15.918 16.88 19 12 19c-4.88 0-8.588-3.082-9.964-6.678Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-[0.5rem]">
              <input
                type="checkbox"
                id="remember"
                className="w-[0.875rem] h-[0.875rem] border-slate-300 rounded text-[#10b981] focus:ring-[#10b981] cursor-pointer"
              />
              <label htmlFor="remember" className="text-slate-600 text-[0.75rem] cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#0da372] disabled:bg-emerald-300 text-white font-bold py-[0.75rem] rounded-[0.5rem] text-[0.875rem] transition-all shadow-sm active:scale-[0.98]"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>

      {/* Reset Password Modal (Full Responsive) */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-[1rem]">
          <div className="bg-white rounded-[0.75rem] w-full max-w-[22.5rem] p-[1.5rem] shadow-2xl border border-slate-100">
            <h2 className="text-[1.125rem] font-bold text-slate-900 mb-[0.25rem]">Reset Password</h2>
            <p className="text-slate-500 text-[0.75rem] mb-[1.25rem]">Enter details to update your password</p>

            {success && <div className="bg-green-50 text-green-600 p-[0.5rem] rounded-[0.5rem] text-[0.7rem] mb-[1rem]">{success}</div>}
            
            <form onSubmit={handleResetPassword} className="space-y-[1rem]">
              <div>
                <label className="block text-[0.625rem] font-bold uppercase tracking-wider text-slate-500 mb-[0.25rem]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  className="w-full px-[0.75rem] py-[0.5rem] border border-slate-200 rounded-[0.5rem] focus:border-[#10b981] outline-none text-[0.875rem]"
                  required
                />
              </div>
              <div>
                <label className="block text-[0.625rem] font-bold uppercase tracking-wider text-slate-500 mb-[0.25rem]">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  className="w-full px-[0.75rem] py-[0.5rem] border border-slate-200 rounded-[0.5rem] focus:border-[#10b981] outline-none text-[0.875rem]"
                  required
                />
              </div>
              <div className="flex gap-[0.5rem] pt-[0.5rem]">
                <button type="button" onClick={() => setShowResetModal(false)} className="flex-1 py-[0.5rem] text-[0.75rem] font-semibold text-slate-600 hover:bg-slate-50 rounded-[0.5rem] transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#10b981] text-white py-[0.5rem] text-[0.75rem] font-semibold rounded-[0.5rem] hover:bg-[#0da372] transition-colors">
                  {loading ? '...' : 'Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
