import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login?error=true', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">Completing login...</div>
    </div>
  );
};

export default OAuth2Callback;
