import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { postData } from '../services/api';
import Expires from '../components/expires';
import Loading from '../components/loading';

// Création du contexte d'authentification
export const AuthContext = createContext();

// Fonction pour rafraîchir le token d'authentification
export const refreshAuthToken = async (logout, setAuth) => {
  try {
    const response = await postData('api/refresh-token', {}, logout);
    if (response && response.token) {
      localStorage.setItem('token', response.token); // Sauvegarder le nouveau token
      const decoded = jwtDecode(response.token);
      setAuth({ user: { id: decoded.id }, token: response.token });
      return response.token;
    } else {
      throw new Error('Impossible de rafraîchir le token');
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error.message || error);
    logout(); // Déconnexion en cas d'erreur
    return null;
  }
};

// Fonction pour vérifier le token "Remember Me"
const verifyRememberMeToken = async (logout) => {
  try {
    const response = await postData('api/remember-me', {}, logout);
    if (response && response.token) {
      return response.token;
    } else {
      throw new Error('Impossible de vérifier le token Remember Me');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token Remember Me:', error.message || error);
    logout(); // Déconnexion en cas d'erreur
    return null;
  }
};

// Composant provider pour l'authentification
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fonction pour gérer la déconnexion
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token'); // Token d'accès
    setAuth({ user: null, token: null });
    setShowModal(false);
  }, []);

  // Fonction pour vérifier l'authentification au chargement
  const checkAuth = useCallback(async (deconnexion = false) => {
    let token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setAuth({ user: { id: decoded.id }, token });
        } else {
          handleTokenExpiration();
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error.message || error);
        handleTokenExpiration();
      }
    } else if (!deconnexion) {
      const rememberMeToken = localStorage.getItem('rememberMeToken'); // Token Remember Me
      if (rememberMeToken) {
        token = await verifyRememberMeToken(handleLogout);
        if (token) {
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          setAuth({ user: { id: decoded.id }, token });
        }
      }
    }
    setLoading(false);
  }, [handleLogout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleTokenExpiration = () => {
    setShowModal(true);
  };

  // Fonction pour gérer la connexion
  const login = async (credentialsOrToken) => {
    try {
      let token;
      if (typeof credentialsOrToken === 'string') {
        // Si credentialsOrToken est un token (string), stockez-le directement
        token = credentialsOrToken;
        localStorage.setItem('token', token); // Assurez-vous de stocker le token
        const decoded = jwtDecode(token); // Décodez le token JWT pour récupérer les informations utilisateur
        setAuth({ user: { id: decoded.id }, token }); // Mettez à jour l'état d'authentification
      } else {
        const response = await postData('api/signin', credentialsOrToken, handleLogout);
        if (response) {
          if (response.accessToken) {
            token = response.accessToken;
            localStorage.setItem('token', token); // Stockez le token dans le localStorage
            const decoded = jwtDecode(token);
            setAuth({ user: { id: decoded.id }, token });
          } else {
            throw new Error('Token non fourni par le serveur.');
          }
        } else {
          throw new Error('Réponse du serveur non valide.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message || error);
      throw error;
    }
  };

  // Fonction pour gérer la tentative de rafraîchissement du token après expiration
  const handleRetry = async () => {
    const token = await refreshAuthToken(handleLogout, setAuth);
    if (token) {
      setShowModal(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout: handleLogout, checkAuth, refreshAuthToken }}>
      {!loading && children}
      {showModal && <Expires onRetry={handleRetry} />}
    </AuthContext.Provider>
  );
};
