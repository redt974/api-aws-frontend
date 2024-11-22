import React, { useState } from 'react';
import './index.css'; 

const Expires = ({ onRetry }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [error, setError] = useState(null); // État pour gérer les erreurs

    const handleRetry = async () => {
        try {
            await onRetry(); // Appelle la fonction pour obtenir un nouveau token
            setIsVisible(false); // Cache la modal après le succès
            setError(null); // Réinitialiser l'erreur en cas de succès
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            setError('Impossible de rafraîchir la session. Veuillez vous reconnecter.');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Votre session a expiré. Voulez-vous continuer ?</p>
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleRetry}>Essayer de se reconnecter</button>
            </div>
        </div>
    );
};

export default Expires;
