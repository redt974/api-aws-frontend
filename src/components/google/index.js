import React, { useCallback } from 'react'; 
import './index.css'; 
import { postData } from '../../services/api';
import google from './assets/google.svg';

// Fonction utilitaire pour rediriger l'utilisateur vers une URL spécifiée
function navigate(url) {
    window.location.href = url; // Change la localisation actuelle du navigateur pour rediriger vers la nouvelle URL
}

function Google() {

    // Utilisation de useCallback pour mémoriser la fonction auth afin d'éviter de la recréer à chaque rendu
    const auth = useCallback(async () => {
        try {
            // Envoie une requête POST pour obtenir l'URL de redirection de Google OAuth
            const data = await postData('google/request');
            if (data?.url) {
                // Si l'URL est reçue, redirige l'utilisateur vers l'URL Google OAuth
                navigate(data.url);
            } else {
                // Si l'URL n'est pas présente dans la réponse, log un message d'erreur
                console.error('URL manquante dans la réponse:', data);
            }
        } catch (error) {
            // Gestion des erreurs lors de la requête
            console.error('Erreur lors de l\'authentification:', error.message);
        }
    }, []); // Dépendances vides pour que la fonction ne soit créée qu'une seule fois

    return (
        <div>

            <button className="google-btn-auth" type="button" onClick={auth}>
                <img src={google} alt="Logo Google" />
                <p>Continuer avec Google</p>
            </button>
        </div>
    );
};

export default Google; 
