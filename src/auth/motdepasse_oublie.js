import React, { useEffect, useState, useContext } from 'react';
import { postData } from '../services/api';
import Response from '../components/response';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContext.js';

const MotDePasseOublie = () => {

  // États pour gérer l'email, les messages et les erreurs
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // Extraction des fonctions logout et refreshToken depuis le contexte AuthContext
  const { logout, refreshToken } = useContext(AuthContext);

  // Effet pour rediriger vers la page d'accueil si un token est présent
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/singin');
    }
  }, [navigate]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la demande de réinitialisation du mot de passe
      const result = await postData('api/forgot_mdp', { email }, logout, refreshToken);

      // Traitement de la réponse du serveur
      if (result.message) {
        setIsSuccess(true);
        setMessage(result.message);
        setError('');
      } else {
        throw new Error(result.message || 'Une erreur s\'est produite.');
      }
    } catch (err) {
      setMessage('');
      setError(err.message || 'Une erreur s\'est produite.');
    }
  };

  // Affichage d'une réponse de succès si la demande est réussie
  if (isSuccess) {
    return <Response titre="Succès" message={message} />;
  }

  // Rendu du formulaire de demande de réinitialisation du mot de passe
  return (
    <div className='MotdepasseOublie'>
      <div className='formulaire motdepasseoublie'>
        <h2>Mot de passe Oublié ?</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Entrez votre adresse email :</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            tabIndex={1}
            autoFocus
            autoCapitalize="none"
            spellCheck="false"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" tabIndex={2}>Envoyer</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default MotDePasseOublie;
