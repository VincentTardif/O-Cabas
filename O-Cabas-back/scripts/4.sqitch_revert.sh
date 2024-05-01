# Initialisation de PGUSER
export PGUSER=ocabas
export PGPASSWORD=ocabas # ce n'est pas une bonne pratique en PROD, les mots de passe ne doivent pas être visible / écrit en dur
export PGDATABASE=ocabas

# Retour arrière jusqu'au script nom_du_script
# sqitch revert nom_du_script

# Retour arrière de toutes les versions
sqitch revert -y