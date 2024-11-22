# API AWS Frontend

Ce projet frontend est une interface utilisateur pour interagir avec l'API AWS Backend. Il gère les fonctionnalités d'authentification, de gestion des utilisateurs, de création et de gestion des machines virtuelles (VM), ainsi que des actions de déconnexion, de réinitialisation de mot de passe, et plus encore.

## Prérequis

1. **Node.js** : Assurez-vous que Node.js est installé sur votre machine. Vous pouvez vérifier la version avec :
   ```
   node -v
   ```

2. **Installation des dépendances** : Le projet utilise `npm` pour gérer les dépendances, assurez-vous que les packages sont installés avant de démarrer le projet.

## Installation

1. Clonez ou téléchargez le projet.
2. Accédez au dossier du projet dans votre terminal :
   ```
   cd C:\Users\vandi\Downloads\api-aws-frontend
   ```
3. Installez les dépendances nécessaires :
   ```
   npm install
   ```

## Lancer l'application

Après avoir installé les dépendances, lancez le projet avec la commande suivante :
```
npm start
```

Cela démarrera l'application React sur le port par défaut (3000).

## Fonctionnalités principales

### 1. **Authentification et gestion des utilisateurs**
   - **Inscription** : Les utilisateurs peuvent s'inscrire via le formulaire d'inscription (`/auth/inscription`).
   - **Connexion** : Authentification des utilisateurs via `connexion.js` avec gestion du token JWT.
   - **Déconnexion** : Déconnexion et suppression du token.
   - **Réinitialisation de mot de passe** : Permet aux utilisateurs de réinitialiser leur mot de passe.
   - **Middleware d'authentification** : Le composant `middleware.js` vérifie si l'utilisateur est authentifié et le redirige en fonction de son statut.

### 2. **Gestion des machines virtuelles (VM)**
   - **Création de VM** : Le frontend permet la création de machines virtuelles via les API définies dans `/VM`.
   - **Gestion du VPN** : Téléchargement et configuration du VPN pour les VMs.

### 3. **Modaux et gestion des erreurs**
   - **Expires** : Si un token expire, un modal s'affiche pour permettre à l'utilisateur de se reconnecter.
   - **Loading** : Un composant de chargement est utilisé pour les actions longues (par exemple, lors de la création ou suppression d'une VM).

### 4. **Gestion des réponses du backend**
   - Les réponses du backend sont gérées dans le composant `response.js` pour afficher un message d'erreur ou de succès à l'utilisateur.

### 5. **Erreur globale**
   - **ErrorBoundary** : Un composant pour gérer les erreurs globales de l'application et empêcher le plantage de l'UI.

## Détails du code

### Authentification

Le code d'authentification est centralisé dans le dossier `auth`, avec un `authContext.js` pour gérer l'état global de l'utilisateur, ainsi que des composants spécifiques pour la connexion, la déconnexion et l'inscription.

- **authContext.js** : Fournit un contexte d'authentification pour toute l'application.
- **middleware.js** : Un middleware pour vérifier si l'utilisateur est authentifié avant d'accéder aux routes protégées.
  
### Services

Le fichier `services/api.js` contient des fonctions pour interagir avec le backend via des requêtes HTTP (par exemple, `postData` pour envoyer des données au backend).

### Gestion des VM

Le dossier `VM` contient les composants responsables de la gestion des machines virtuelles, comme la création de VM et le téléchargement des configurations VPN.

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez contribuer, veuillez forker ce projet et soumettre une pull request avec vos améliorations.