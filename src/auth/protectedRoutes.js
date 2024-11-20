import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Si l'utilisateur n'est pas authentifié, rediriger vers /signin
  if (!auth.user) {
    return <Navigate to="/signin" replace />;
  }

  return children; // Sinon, afficher le contenu protégé
};

export default ProtectedRoute;
