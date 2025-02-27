const BACK_URL = process.env.REACT_APP_API_URL; // Récupération de l'URL de base du backend depuis les variables d'environnement

/**
 * Fonction pour faire des demandes d’API (GET, POST, etc.) au backend.
 * @param {string} path - Le chemin de fin pour l’API.
 * @param {string} method - La méthode HTTP (GET, POST, etc.), par défaut est 'GET'.
 * @param {Object} data - La charge utile de requête pour des méthodes comme POST.
 * @param {Function} logout - La fonction permettant de déconnecter l’utilisateur.
 * @param {Function} refreshToken - La fonction pour actualiser le jeton.
 * @returns {Object} - Les données de réponse ou renvoie une erreur si la requête échoue.
 */

// Fonction générique pour effectuer des requêtes API
export async function fetchData(path, method = 'GET', data = null, logout, refreshToken, customHeaders = {}, expectBlob = false) {
  try {
    // Construction de l'URL complète pour la requête
    const url = `http://${BACK_URL}/${path}`;
    let token = localStorage.getItem('token'); // Récupération du token d'authentification depuis le stockage local
    const headers = {
      'Content-Type': 'application/json', // Définition de l'en-tête Content-Type
      ...customHeaders, // Ajout des en-têtes personnalisés
    };

    // Ajout du token d'authentification aux en-têtes si présent
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Définition des options de la requête
    let options = {
      method: method, // Méthode de la requête (GET, POST, etc.)
      headers: headers, // En-têtes de la requête
      credentials: 'include', // Inclusion des cookies dans la requête
    };

    // Ajout du corps de la requête pour les requêtes POST
    if (data) {
      options.body = JSON.stringify(data);
    }

    // Exécution de la requête
    let response = await fetch(url, options);

    // Gestion des erreurs d'authentification (code 401)
    if (response.status === 401 && typeof refreshToken === 'function') {
      return refreshTokenAndRetry(path, options, logout, refreshToken); // Rafraîchissement du token et nouvelle tentative de la requête
    }

    // Gestion des erreurs de réponse du serveur
    if (!response.ok) {
      let errorMessage = 'Erreur de réponse du serveur';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage; // Extraction du message d'erreur depuis la réponse du serveur
      } catch (e) {
        console.warn('La réponse du serveur ne contient pas de JSON valide.');
      }
      throw new Error(errorMessage); // Lancer une erreur avec le message d'erreur
    }

    return expectBlob ? response.blob() : response.json();
  } catch (error) {
    console.error('Erreur:', error.message || error); // Gestion des erreurs
    if (error.message && error.message.includes('Session expirée') && typeof logout === 'function') {
      logout(); // Déconnexion si la session a expiré
    }
    throw error; // Lancer l'erreur pour la gestion en amont
  }
}

// Fonction pour rafraîchir le token et réessayer la requête
async function refreshTokenAndRetry(path, options, logout, refreshToken) {
  try {
    // Rafraîchir le token
    const newToken = await refreshToken(logout);
    if (newToken) {
      options.headers['Authorization'] = `Bearer ${newToken}`; // Mise à jour de l'en-tête avec le nouveau token
      // Réessayer la requête avec le nouveau token
      const response = await fetch(`http://${BACK_URL}/${path}`, options);

      // Gestion des erreurs de la nouvelle requête
      if (!response.ok) {
        let errorMessage = 'Erreur de réponse du serveur';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.warn('La réponse du serveur ne contient pas de JSON valide.');
        }
        throw new Error(errorMessage); // Lancer une erreur avec le message d'erreur
      }

      return await response.json(); // Retourner les données JSON de la réponse
    } else {
      throw new Error('Session expirée. Veuillez vous reconnecter.'); // Erreur si le rafraîchissement du token échoue
    }
  } catch (error) {
    // Gestion des erreurs lors du rafraîchissement du token ou de la nouvelle requête
    console.error('Erreur lors du rafraîchissement ou de la requête:', error.message || error);
    logout(); // Déconnexion en cas d'erreur
    throw error; // Lancer l'erreur pour la gestion en amont
  }
}

// Fonction pour les requêtes POST
export async function postData(path, data, logout, refreshToken, customHeaders = {}) {
  return fetchData(path, 'POST', data, logout, refreshToken, customHeaders); // Appel de la fonction générique avec la méthode POST
}

// Fonction pour les requêtes GET
export async function getData(path, logout, refreshToken, customHeaders = {}) {
  return fetchData(path, 'GET', null, logout, refreshToken, customHeaders); // Appel de la fonction générique avec la méthode GET
}

