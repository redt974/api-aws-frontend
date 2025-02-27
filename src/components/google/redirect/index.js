import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

import { AuthContext } from '../../../auth/authContext'; 
import Loading from '../../loading'; 

const GoogleRedirect = () => {
    const { login } = useContext(AuthContext); // Extraction de la fonction login du contexte d'authentification
    const navigate = useNavigate(); // Utilisation du hook useNavigate pour la redirection

    useEffect(() => {
        // Fonction asynchrone pour gérer l'authentification
        const handleAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
          
            if (token) {
              try {
                await login(token);
                console.log('Login successful'); // Log de succès de connexion
                navigate('/');
              } catch (error) {
                console.error('Erreur lors de la connexion:', error); // Log de l'erreur
                navigate('/connexion');
              }
            } else {
              console.error('Token JWT manquant dans l\'URL.');
              navigate('/connexion');
            }
          };
          

        handleAuth();
    }, [login, navigate]); 

    return (<Loading/>); 
};

export default GoogleRedirect; 
