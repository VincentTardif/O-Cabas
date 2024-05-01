# Initialisation de PGUSER
 export PGUSER=spedata

# Suppression de la BDD "ocolis" (si elle existe)
dropdb ocabas

# Suppression du User "admin_ocolis"
dropuser ocabas

# Création d'un user propriétaire de la BDD - "admin_ocolis"
createuser ocabas -P # -P est un prompt pour demander le mot de passe

# Création de la BDD "ocolis"
createdb ocabas -O ocabas
