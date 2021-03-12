---
theme: "journal"
title: "procédure de mise à jour de l'application"
date: "2021-03-12"
---
###1.  Base neo4j

Dump local: ne pas oublier d'arrêter le serveur. Dans le répertoire `/var/lib/neo4j` 

    sudo -u neo4j neo4j-admin dump --database=neo4j --to=backups/maquisdoc/vx-yy.dump

où `x-yy` est la version de la base.

Copie de la base sur le droplet

Avec `scp`

    scp /var/lib/neo4j/backups/maquisdoc/vx-yy.dump remy@***.***.***.***:/home/remy/dumps
    
sur le droplet copier le fichier au bon endroit

    sudo  cp dumps/vx-yy.dump /var/lib/neo4j/backups/maquisdoc/vx-yy.dump

et changer le propriétaire en neo4j

    sudo chown neo4j:neo4j /var/lib/neo4j/backups/maquisdoc/vx-yy.dump
    
Load de la base (dans `/var/lib/neo4j`). Ne pas oublier d'arrêter le serveur avant!

    sudo -u neo4j neo4j-admin load --from=backups/maquisdoc/vx-yy.dump --database=neo4j --force

Relancer le serveur 

###2. Commit du projet maquisdoc-graphql sur GitHub

###3. Commit du projet maquisdoc-gatsby sur GitHub
