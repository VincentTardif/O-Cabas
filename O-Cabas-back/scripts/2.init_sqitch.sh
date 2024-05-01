# suppression du sqitch.plan
rm ./migrations/sqitch.plan

# initialisation du projet Sqitch
sqitch init ocabas --engine pg --top-dir ./migrations

# ajout des migrations
sqitch add 1.init -n 'création des tables'