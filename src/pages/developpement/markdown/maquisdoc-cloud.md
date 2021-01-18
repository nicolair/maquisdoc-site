---
theme: "journal"
title: "maquisdoc: cloud"
date: "2021-01-04"
---

Il s'agit de passer du fonctionnement local de l'application à un fonctionnement dans le cloud.

- la base neo4j (communauté) est un *service* du droplet dans digital ocean.
- le serveur graphql apollo est un service du droplet. 
- maquisdoc est une *application* Gatsby sur la plate-forme Digital Ocean.

À faire

1. Insérer la base dans le neo4j du droplet
1. Paramétrer correctement le serveur neo4j sur le droplet pour permettre un accès distant du browser et un accès local du serveur apollo.
2. Faire tourner apollo comme un service sur le droplet communicant localement avec la base neo4j.
3. Modifier le gatsby-config.js pour qu'il puisse fonctionner comme static site sur digital ocean et localement.
4. Mettre à jour le code de l'appli maquisdoc sur GitHub pour relancer l'application maquisdoc de digital ocean.

On dispose alors de deux sites statiques Gatsby

* un site local en développement
* un site distant (production) appli Digital Ocean

Les deux communiquent avec le même serveur apollo et la même base neo4j sur le droplet.

### 1. Insertion de la base

L'OS est Fedora 33 localement et sur le droplet Digital Ocean  
Pour les outils suivants, il faut de placer dans le répertoire de base de neo4j qui est : `/var/lib/neo4j`  
Outils

+ `neo4j-admin` par l'utilisateur `neo4j`: en particulier pour `dump` et `load`.
+ `cypher-shell` pour communiquer avec la base en ligne de commande

Le fichier de configuration est `/etc/neo4j/neo4j.conf`.

On crée un sous-répertoire `backups/maquisdoc`  dans le dossier de base de neo4j (comme utilisateur neo4j). On copie la dernière version "dumpée" dela base `v1-2.dump` avec `scp`. Il faut faire une petite salade d'utilisateurs entre `remy`, `root` et `neo4j` et utiliser `chown`.

L'utilisateur neo4j de la base est muni d'un vrai mot de passe.

### 2. Paramétrisation du serveur neo4j

On édite `/etc/neo4j/neo4j.com` avec `nano` qui est le nouvel éditeur par défaut de fedora. Les lignes suivantes sont modifiées

    dbms.default_listen_address=0.0.0.0
    dbms.default_advertised_address=*****
    
pour écouter toutes les adresses IP et indiquer l'IP du droplet.

Si ça ne marche pas en non local, il est possible que le firewall du serveur bloque les ports (par exemple le port 7474 pour le browser). C'est ce qui se passe dans mon cas. Le test du port avec `nmap` répond qu'il est dans l'état `filtered` ce qui traduit un bloquage par le firewall.  
Bien que le serveur soit sous fedora 33, le firewall est encore géré par le service `iptables` et non par `firewalld`. Après avoir examiné les règles en vigueur j'en ajoute deux (en position 7 et 8) autorisant le passage pour les protocoles http et bolt:

    sudo iptables -I INPUT 7 -p tcp --dport 7474 -j ACCEPT
    sudo iptables -I INPUT 8 -p tcp --dport 7687 -j ACCEPT
    
### 3. Serveur GraphQL apollo
L'agencement des services est identique, le serveur apollo et la base neo4j fonctionnent sur la même machine:  localement sur mon ordinateur (développement) ou sur le droplet Digital Ocean (production).
On change le nom du fichier principal de `index.js` à `maquisdoc-apollo.js`.

1. Transfert du code via github.  
On utilise github pour transférer le code du serveur node du local au droplet. Comme ce code est lisible par tout le monde, il ne faut pas y écrire le nom d'utilisateur et mot de passe de connection à la base neo4j.  

2. Modification de `maquisdoc-apollo.js`, variables d'environnement.  
On utilise le module `process` de node.js pour passer les données de connection avec des variables d'environnement.

        const neo4j_url = "bolt://localhost:7687"
        const neo4j_pw = process.env.NEO4J_PASSWORD
        const neo4j_username = process.env.NEO4J_USERNAME
        const driver = neo4j.driver(
            neo4j_url,
            neo4j.auth.basic(neo4j_username,neo4j_pw)
        );
Pour affecter une valeur à une variable d'environnement, on insère 
    `export VARNAME=value`
à la fin du fichier `~/.bashrc` avec `nano` ([référence](https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-linux)).

3. Apollo serveur comme un service.  
On utilise `PM2` qui est un manager de processus pour les applications node.js ([référence](https://pm2.keymetrics.io/)).  
Installation avec `npm install pm2@latest -g` et non avec `dnf`.  
On lance le serveur avec `pm2 start maquisdoc-apollo.js` dans le bon répertoire.

Remarque. L'utilisation de variable d'environnement permet de garder le même code bien que les bases neo4j aient des mots de passe distincts localement et sur le droplet 

Installation sur le droplet

* installation de node et npm via dnf
* installation des modules node.js: 
* ouverture du port `sudo iptables -I INPUT 8 -p tcp --dport 7687 -j ACCEPT`
* variable d'environnement `export NEO4J_PASSWORD = ***` dans le `./bashrc`.
* lancement par la commande `pm2 start ecosystem.config.js`

Le lancement direct par `pm2 start maquisdoc-appolo.js` conduit à une erreur d'authentification sur neo4j due à un mauvais passage des variables d'environnement. Le passage se fait bien par l'intermédiare de `ecosystem.config.js`

    module.exports = {
    apps : [{
        name: "maquisdoc-apollo",
        script: './maquisdoc-apollo.js',
    }],

    }
    
4. Mise à jour de gatsby.config.  
Il faut modifier les paramètres du plugin `gatsby-source-graphql` pour qu'il interroge le serveur sur le droplet.  
Ici encore, on pourrait utiliser des variables d'environnement pour garder le même code localement (développement) et sur le droplet (production) mais il y a un problème avec le passage des variables d'environnement sur l'application Digital Ocean.

5. Déploiement sur digital ocean:  
automatique lorsque le projet sur GitHub est mis à jour. OK sauf pour la variable d'environnement.

### Architecture
Initialement, je pensais implémenter le service GraphQL apollo dans le cadre des applications digital ocean mais ce n'est pas gratuit. Je l'ai donc implanté sur le droplet.

Je souhaite passer à une architecture comme une application web sur la plateforme digital ocean avec des conteneurs mais je le ferai quand je n'utiliserai plus le serveur historique de Imingo.

L'architecture actuelle des versions de développement et de production est la suivante.

Développement.  
L'application Gatsby lit les fichiers locaux dans le dossier local `src/pages` de ma macine de travail.

Production: site statique Digital Ocean.  
L'application lit les fichiers dans le dossier `src/pages` du projet sur GitHub.

Les deux applications se connectent aux serveurs apollo puis neo4j **du droplet**.
