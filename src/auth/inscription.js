import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { postData } from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from './authContext.js';
import { validateLoginForm } from './validation.js';
import MiddlewareAuth from './middleware.js';

function Register() {

  // Rediriger si l'utilisateur est déjà connecté
  MiddlewareAuth();

  // Extraction des fonctions logout et refreshToken depuis le contexte AuthContext
  const { logout, refreshToken } = useContext(AuthContext);

  // State pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: ''
  });

  // State pour les messages d'erreur et de succès
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Référence pour le reCAPTCHA
  const recaptcha = useRef();

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des données du formulaire
    const validationError = validateLoginForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Vérification de la réponse du reCAPTCHA
    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      setError('Veuillez vérifier le reCAPTCHA!');
      return;
    }

    try {
      // Envoi des données du formulaire au serveur
      const response = await postData('api/signin', { ...formData, captchaValue }, logout, refreshToken);

      if (response.status === 200) {
        // Si la demande est réussie, affichage d'un message de succès
        setMessage("Demande d'Inscription faite. Nous vous répondrons prochainement !");
        setError('');
      } else {
        // Si la réponse contient une erreur, affichage du message d'erreur
        setError(response.error);
        setMessage('');
      }
    } catch (error) {
      // Gestion des erreurs
      console.error('Erreur lors de la requête:', error);
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div className='formulaire inscription'>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom :</label>
        <input type="text" name="nom" autoComplete="off" tabIndex={1} autoFocus autoCapitalize="none" spellCheck="false" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <label htmlFor="prenom">Prénom :</label>
        <input type="text" name="prenom" placeholder="Prénom" autoComplete="off" tabIndex={2} autoCapitalize="none" spellCheck="false" value={formData.prenom} onChange={handleChange} required />
        <label htmlFor="email">Email :</label>
        <input type="email" name="email" autoComplete="off" tabIndex={3} autoCapitalize="none" spellCheck="false" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <label htmlFor="mot_de_passe">Mot de Passe :</label>
        <input type="password" name="mot_de_passe" autoComplete="off" tabIndex={4} autoCapitalize="none" spellCheck="false" placeholder="Mot de passe" value={formData.mot_de_passe} onChange={handleChange} required />
        <ReCAPTCHA ref={recaptcha} tabIndex={6} sitekey={process.env.REACT_APP_CAPTCHA_KEY} />
        <button type="submit" tabIndex={7}>S'inscrire</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Vous avez déjà un compte ?</p>
      <Link to="/signin">Connectez-vous !</Link>
    </div>
  );
}

export default Register;
