import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setStep(2);
      setSuccessMessage(response.data.message || 'OTP sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">CanvaClone</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        </div>

        <div className="card">
          {successMessage && step === 2 && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3 text-sm font-medium mb-6">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11" 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-3"
              >
                {loading ? <LoadingSpinner /> : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="input-field pl-11 bg-gray-100 text-gray-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 6-digit OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field pl-11" 
                    placeholder="123456" 
                    maxLength={6}
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pl-11" 
                    placeholder="Enter new password" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-3"
              >
                {loading ? <LoadingSpinner /> : 'Reset Password'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Back to email input
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-gray-600">
            Remember your password? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
