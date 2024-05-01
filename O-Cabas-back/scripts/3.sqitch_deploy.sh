# Initialisation de PGUSER
export PGUSER=ocabas
export PGPASSWORD=ocabas # ce n'est pas une bonne pratique en PROD, les mots de passe ne doivent pas être visible / écrit en dur
export PGDATABASE=ocabas

# Déploiement du script nom_du_script
#sqitch deploy nom_du_script

# Déploiement jusqu'à la dernière version
sqitch deploy