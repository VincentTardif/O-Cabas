// Importation du module 'spawn' depuis le module 'child_process'
import { spawn } from 'child_process';

// Chemin vers l'index server Node.js principal
const script_path = './server.js';

// Fonction pour démarrer le serveur
async function start_server() {
    console.log('Démarrage du serveur...');

    // Lance un nouveau processus Node.js en exécutant le script principal défini par 'script_path'
    // stdio: 'inherit' permet de partager les entrées et sorties standard du processus parent avec le processus enfant
    const server_process = spawn('node', [script_path], { stdio: 'inherit' });

    // Gestionnaire d'événement pour l'événement 'close' du processus
    server_process.on('close', (code) => {
        // Affiche un message indiquant la fermeture du serveur et le code de sortie
        console.log(`Le serveur s'est arrêté avec le code ${code}. Redémarrage...`);

        // Redémarre le serveur après une courte pause
        setTimeout(start_server, 1000);
    });
}

start_server();
