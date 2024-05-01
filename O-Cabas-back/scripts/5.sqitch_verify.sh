# Initialisation de PGUSER
export PGUSER=ocabas
export PGPASSWORD=ocabas # ce n'est pas une bonne pratique en PROD, les mots de passe ne doivent pas être visible / écrit en dur
export PGDATABASE=ocabas

sqitch verify

# Vérification de la version courante
#sqitch verify {version sqitch}