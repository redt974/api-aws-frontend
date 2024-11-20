import React, { useState } from 'react';
import './index.css'; 

const Expires = ({ onRetry }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleRetry = async () => {
        try {
            await onRetry(); // Appelle la fonction pour obtenir un nouveau token
            setIsVisible(false); // Cache la modal après le succès
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Vous avez été déconnecté, votre session a expiré</p>
                <button onClick={handleRetry}>Êtes-vous toujours là ?</button>
            </div>
        </div>
    );
};

export default Expires;
