import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postData } from '../services/api';
import { AuthContext } from './authContext.js';
import Response from '../components/response';
import { validatePassword } from './validation';

const Reinitialisation = () => {

  // Extraction des fonctions du contexte AuthContext
  const { logout, refreshToken } = useContext(AuthContext);

  // États pour gérer les champs de mot de passe, messages et succès
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Hooks pour gérer la navigation et les paramètres de l'URL
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  // Effet pour vérifier la présence d'un token dans l'URL et rediriger si nécessaire
  useEffect(() => {
    // Si aucun token n'est présent dans l'URL, rediriger vers la page d'accueil
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  // Effet pour rediriger vers la page de connexion après une réinitialisation réussie
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000); // Réduction du délai à 10 secondes
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Fonction pour gérer la soumission du formulaire de réinitialisation du mot de passe
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
      setMessage('');
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('');
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const result = await postData('api/reset_mdp', { token, password }, logout, refreshToken);

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

  // Affichage d'un message de succès si la réinitialisation a réussi
  if (isSuccess) {
    return <Response titre="Succès" message={message} />;
  }

  return (
    <div className='Reinitialisation'>
      <div className='formulaire resetmdp'>
        <h2>Réinitialisation du mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Nouveau mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            tabIndex={1}
            autoFocus
            autoCapitalize="none"
            spellCheck="false"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm_password">Confirmer mot de passe :</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            autoComplete="off"
            tabIndex={2}
            autoCapitalize="none"
            spellCheck="false"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Réinitialiser le mot de passe</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Reinitialisation;
