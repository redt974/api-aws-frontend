import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Définir les routes publiques et privées
const publicRoutes = ['/signin', '/signup', '/forgot_mdp', '/reset_mdp'];
const privateRoutes = ['/']; // Exemple de routes protégées

function MiddlewareAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage

    if (token) {
      // Si l'utilisateur est connecté et accède à une route publique, rediriger vers la page d'accueil
      if (publicRoutes.includes(currentPath)) {
        navigate('/'); // Redirection vers la page d'accueil
      }
    } else {
      // Si l'utilisateur n'est pas connecté et accède à une route privée, rediriger vers /signin
      if (privateRoutes.includes(currentPath)) {
        navigate('/signin'); // Redirection vers la page de connexion
      }
    }
  }, [navigate, currentPath]);

  return null; // Ce composant ne rend rien, il gère uniquement les redirections
}

export default MiddlewareAuth;
