import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';

// Clé secrète pour signer et vérifier les tokens JWT
const SECRET_KEY = 'votre_clé_secrète';

// Durée de validité du token de réinitialisation (10 minutes)
const RESET_TOKEN_EXPIRATION = 10; // en minutes

// Fonction pour générer un token de réinitialisation de mot de passe
function genererTokenResetMotDePasse(userId) {
    return jwt.sign({ userId: userId, exp: moment().add(RESET_TOKEN_EXPIRATION, 'minutes').unix() }, SECRET_KEY);
}

// Fonction pour valider et décoder le token de réinitialisation de mot de passe
function validerTokenResetMotDePasse(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded.userId;
    } catch (error) {
        console.error("Erreur de validation du token de réinitialisation:", error);
        return null;
    }
}

// Fonction pour réinitialiser le mot de passe d'un utilisateur
async function resetMotDePasseUtilisateur(userId, nouveauMotDePasse) {
    try {
        // Hasher le nouveau mot de passe
        const hash = await bcrypt.hash(nouveauMotDePasse, 10);
        
        // Logique pour mettre à jour le mot de passe dans la base de données avec le hash
        console.log(`Mot de passe de l'utilisateur avec l'ID ${userId} réinitialisé avec succès.`);

        // Optionnel : supprimer le token de réinitialisation après utilisation
        // Ceci dépend de votre application et de la politique de gestion des tokens de réinitialisation
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    }
}

// Exemple d'utilisation
const userId = 123; // Identifiant de l'utilisateur
const token = genererTokenResetMotDePasse(userId);
console.log("Token de réinitialisation:", token);

// Simulation de l'accès au lien de réinitialisation avec le token
const userIdFromToken = validerTokenResetMotDePasse(token);
if (userIdFromToken !== null) {
    console.log("Token valide, permettant la réinitialisation du mot de passe pour l'utilisateur avec l'identifiant:", userIdFromToken);
    const nouveauMotDePasse = "nouveau_mot_de_passe";
    resetMotDePasseUtilisateur(userIdFromToken, nouveauMotDePasse);
} else {
    console.log("Token invalide ou expiré.");
}
