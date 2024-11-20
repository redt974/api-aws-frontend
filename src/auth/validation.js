// Validation des champs d'email
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return "L'email n'est pas valide.";
    }
    return null;
};

// Validation des champs de mot de passe
export const validatePassword = (mot_de_passe) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(mot_de_passe)) {
        return "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.";
    }
    return null;
};

// Validation des champs du formulaire de connexion
export const validateLoginForm = (formData) => {
    return (
        validateEmail(formData.email) ||
        validatePassword(formData.mot_de_passe)
    );
};