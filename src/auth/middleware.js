import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function MiddlewareAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Définir les routes pour les pages qui nécessitent et ne nécessitent pas d'authentification
  const publicRoutes = ['/signin', '/signup', '/forgot_mdp', '/reset_mdp']; 
  const privateRoutes = ['/']; // Routes qui nécessitent l'authentification

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérer le token d'authentification depuis le stockage local

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken.isAdmin; // Vérifier le champ isAdmin

        if (publicRoutes.includes(currentPath)) {
          // Si l'utilisateur est connecté et tente d'accéder à une page publique, rediriger vers la page d'accueil
          navigate('/');
        } else if (currentPath === '/admin' && !isAdmin) {
          // Si l'utilisateur n'est pas administrateur et tente d'accéder à la page /admin, rediriger vers la page d'accueil ou autre page
          navigate('/');
        }
      } catch (error) {
        // Si le token est invalide ou ne peut pas être décodé, traiter comme si l'utilisateur n'était pas connecté
        console.error('Erreur lors du décodage du token:', error);
        if (privateRoutes.includes(currentPath)) {
          navigate('/signin');
        }
      }
    } else {
      // Utilisateur non connecté
      if (privateRoutes.includes(currentPath)) {
        // Si l'utilisateur n'est pas connecté et tente d'accéder à une page privée, rediriger vers /signin
        navigate('/signin');
      }
    }
  }, [navigate, currentPath]);

  return null; // Ce composant ne rend rien
}

export default MiddlewareAuth;
