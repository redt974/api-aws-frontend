import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authentification/AuthContext';

function Deconnexion() {

  // Hook pour naviguer entre les pages
  const navigate = useNavigate();

  // Effet pour vérifier la présence du token lors du rendu du composant
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin'); // Redirige vers la page de connexion si aucun token n'est trouvé
    }
  }, [navigate]);
  
  // Utilisation du contexte AuthContext pour accéder aux fonctions de déconnexion
  const { logout, checkAuth } = useContext(AuthContext);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    try {
      logout(); // Déconnexion locale (effacement des informations d'authentification)
      localStorage.removeItem('refreshToken'); // Token de rafraîchissement
      localStorage.removeItem('rememberMeToken'); // Token Remember Me
      checkAuth(true); // Appel de checkAuth avec isManualLogout = true
      navigate('/signin'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message); // Gestion des erreurs
    }
  };

  return (
    <button className='logout' onClick={handleLogout}>
      <img 
        className='logout_logo' 
        src="/assets/images/fontawesome/arrow-right-from-bracket-solid.svg" 
        alt='Logout Icon'
      />
      <p>Déconnexion</p>
    </button>
  );
}

export default Deconnexion;