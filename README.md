# Frontend - Application "Je suis l'Autre"

Ce projet est le frontend de l'application "Je suis l'Autre". Il est construit avec React et utilise des composants modernes pour créer une interface utilisateur interactive.

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (ou yarn)

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/redt974/Je-suis-l-Autre-frontend.git
cd frontend
```

2. Installez les dépendances :

```bash
npm install
```

3. Démarrez l'application :

```bash
npm start
```

L'application frontend devrait maintenant être en cours d'exécution à l'adresse `http://localhost:3000`.

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`

Lance l'application en mode développement.  
Ouvrez [http://localhost:3000](http://localhost:3000) pour la voir dans votre navigateur.

### `npm test`

Lance le runner de tests en mode interactif.  
Voir la section sur [running tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.

### `npm run build`

Construit l'application pour la production dans le dossier `build`.  
Il regroupe correctement React en mode production et optimise la construction pour de meilleures performances.

### `npm run eject`

**Note: cette action est irréversible.**

Si vous n'êtes pas satisfait de l'outil de build et des choix de configuration, vous pouvez `eject` à tout moment. Ce script supprimera la dépendance de build unique de votre projet.

## Utilisation

### Pages principales

- **Accueil** : La page d'accueil de l'application.
- **Inscription** : Permet aux nouveaux utilisateurs de s'inscrire.
- **Connexion** : Permet aux utilisateurs existants de se connecter.
- **Réinitialisation de mot de passe** : Permet aux utilisateurs de réinitialiser leur mot de passe en utilisant un token reçu par email.

## Structure du projet

- `src/` : Contient tous les fichiers source de l'application.
  - `components/` : Composants réutilisables.
  - `pages/` : Pages principales de l'application.
  - `services/` : Services pour les appels API.
  - `App.js` : Composant principal de l'application.
  - `index.js` : Point d'entrée de l'application.

## Contributions

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request pour toute amélioration ou correction de bug.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.