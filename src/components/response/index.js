import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

function Response({ delay = 3000 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { titre, message } = location.state || { titre: 'Information', message: 'Opération effectuée.' };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, delay]);

  return (
    <div className="response-container">
      <h1 className="response-header">{titre}</h1>
      <p className="response-message">{message}</p>
    </div>
  );
}

export default Response;
