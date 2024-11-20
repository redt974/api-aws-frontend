import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import './index.css';

function Error() {
  const error = useRouteError();

  // Fonction pour générer un message d'erreur personnalisé
  const getErrorMessage = () => {
    if (!error) return "Une erreur inconnue s'est produite.";

    switch (error.status) {
      case 404:
        return "Page non trouvée. Il semble que la page que vous recherchez n'existe pas.";
      case 401:
        return "Accès non autorisé. Vous devez être connecté pour accéder à cette page.";
      case 403:
        return "Accès refusé. Vous n'avez pas la permission d'accéder à cette page.";
      case 500:
        return "Erreur interne du serveur. Quelque chose s'est mal passé de notre côté.";
      case 503:
        return "Service indisponible. Le serveur est actuellement indisponible (surchargé ou en maintenance).";
      default:
        return "Une erreur est survenue. Veuillez réessayer plus tard.";
    }
  };

  return (
    <div className="error-page">
      <h1>Oups! Quelque chose s'est mal passé.</h1>
      {error && (
        <div className="error-details">
          <p><strong>Erreur : </strong> {error.status} - {error.statusText || error.message}</p>
        </div>
      )}
      <p>{getErrorMessage()}</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}

export default Error;
