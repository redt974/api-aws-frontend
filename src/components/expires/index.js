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
                <p>Votre session a expiré. Voulez-vous continuer ?</p>
                <button onClick={handleRetry}>Essayer de se reconnecter</button>
            </div>
        </div>
    );
};

export default Expires;
