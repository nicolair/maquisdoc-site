---
theme: "journal"
title: "neo4j: installation"
date: "2020-11-14"
---

neo4j est installé localement (fedora 33) comme un service à partir d'un paquetage yum installé avec dnf en ajoutant un dépôt.


-   suppression des installations précédentes des desktop 3.2.6 et 3.4.9 OK Il ne devrait pas exister de fichiers neo4j postérieurs au 13/11/20.
-   conteneurs: pour le moment, les conteneurs neo4j de remy et de root (sudo) sont conservés.

### Configuration
Le fichier principal de configuration est `/etc/neo4j/neo4j.conf`. 

Commandes pour démarrer ou arrêter le service

    `sudo systemctl start neo4j`
    `sudo systemctl stop neo4j`
    
Attention: arrêter le service avant le service avant de modifier le fichier de configuration.
Pour me simplifier la vie lors du développement . Je ne touche pas au fichier de configuration sauf pour désactiver l'authentification. La ligne suivante est décommentée.

    `dbms.security.auth_enabled=false`
    
**Un point important est que même avec cette commande le service est lancé par l'utilisateur `neo4j` et non `root`. Les dossiers en jeu doivent appartenir à l'utilisateur `neo4j`**


### Outils
en ligne de commande 
-   neo4j-admin 
-   cypher-shell (documentation)[https://neo4j.com/docs/operations-manual/current/tools/cypher-shell/#cypher-shell]

**Attention, ce n'est indiqué très clairement dans la documentation: il faut lancer neo4j-admin comme l'utilisateur neo4j.**

    `sudo -u neo4j neo4j-admin ...`
    
Cet outils ont servi à importer la base maquisdoc extraite du serveur mariadb.

Pour lancer cypher-shell il faut indiquer en paramètres le nom d'utilisateur de la base et le mot de passe. Pour ne pas avoir à retaper à chaque fois, il est commode d'utiliser une [variable d'environnement](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps).

Les valeurs pour NEO4J-USERNAME et NEO4J-PASSWORD sont exportées comme variables d'environnement en modifiant le fichier ~/bashrc.

Pour l'installation locale, j'ai désactivé l'authentification.

On peut aussi utiliser le browser.

