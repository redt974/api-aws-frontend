import React from 'react';

// Composant ErrorBoundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Mettre à jour l'état pour afficher l'interface utilisateur de secours
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Vous pouvez également enregistrer l'erreur dans un service de rapport d'erreurs
        console.error("Une erreur s'est produite:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Vous pouvez personnaliser ce rendu de secours
            return <h1>Quelque chose s'est mal passé. Veuillez réessayer plus tard.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
