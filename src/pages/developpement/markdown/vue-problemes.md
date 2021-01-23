---
theme: "journal"
title: "vue: textes de problème"
date: "2021-01-20"
---
Cette vue permet d'accéder aux problèmes. Elle doit présenter la liste (classée alphabétiquement) selon le titre et des outils de recherche. La structure de base est la liste des problèmes classés alphabétiquement sur le titre. 

La requête cypher de base est donc

    MATCH (p:Document {typeDoc:'problème'})
    RETURN p.titre, p.description, p.url
    ORDER BY p.titre

Je souhaite un champ de recherche textuel sur le titre et la description. Il faut:

* un [index textuel](https://neo4j.com/docs/cypher-manual/3.5/schema/index/#schema-index-fulltext-search) dans la base neo4j, 
* un [champ de recherche](https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-search/) dans le site Gatsby.

### 1. Utilisation d'un index pour la recherche plein texte dans neo4j

[Référence pour la configuration](https://neo4j.com/docs/operations-manual/3.5/performance/index-configuration/fulltext-search/) mais pas de configuration spécifique pour le moment.  

On crée un index des titres et des descriptions pour tous les documents

    CALL db.index.fulltext.createNodeIndex("TitresEtDescriptions",["Document"],["titre","description"])

On cherche le mot "Gauss" avec:

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions","Gauss")
      YIELD node, score
    RETURN node.titre, node.description, node.url, score
    
[Référence](https://neo4j.com/docs/cypher-manual/current/clauses/call/) pour l'appel de procédures. On peut utiliser un paramètre dans la requête

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions",$mot)
      YIELD node, score
    RETURN node.titre, node.description, node.url, score

Ce qui conduit au même résultat que la première forme lorsque le paramètre a été défini dans le browser par `:param mot=> "Gauss"`.  
L'index porte sur tous les documents, pour filtrer seulement les problèmes, on utilise une sous-requête.

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions", $mot)
      YIELD node, score
    WITH node, score
      WHERE node.typeDoc = "problème"
    RETURN node.typeDoc, node.titre, node.description, node.url, score
    
### 2. Modification du schéma GraphQL.
Le script `maquisdoc-apollo.js` n'est pas complètement reproduit dans ce document, seulement les modifications significatives.
Nouvelle requête paramétrée.

    searchpbs (mot:String): [Document] @cypher(statement: """
      CALL db.index.fulltext.queryNodes("TitresEtDescriptions", $mot)
        YIELD node, score
      WHERE node.typeDoc = "problème"
      RETURN  node
    """),
    
Remarque, le *"score"* de la recherche est perdu. Il faudrait modifier le type d'objet que renvoie la requête pour le récupérer.  
Nouvelles requêtes pour obtenir tous les documents de cours et de problèmes.

    coursdocuments : [Document] @cypher(statement: """
      MATCH (d:Document {typeDoc:"cours"})
      RETURN d
    """),
    problemedocuments : [Document] @cypher(statement: """
      MATCH (d:Document {typeDoc:"problème"})
      RETURN d
    """),
    
### 3. Création de pages Gatsby
On modifie `gatsby-node.js` pour créer des pages associées aux noeuds du type *problème*. Elles sont accessibles par url finissant par `/titre` où titre est le titre du problème c'est à dire le coeur des noms des fichiers du problème.

Une page `src/pages/vues/problemes.js` est crée "*à la main*". Elle présente la liste alphabétique avec les url.

### 4. Organisation du passage "*en production*"
1. base neo4j: elle a été modifiée localement (ajout index)
    1. dump local
    2. transfert du fichier sur le droplet
    3. load de la base sur ledroplet
2. serveur apollo
    1. commit local + push sur github
    2. pull sur droplet
3. app maquisdoc sur digital ocean
    1. commit local + push sur git hub
    2. cela déclenche un "build" de l'appli, attention à l'url du serveur apollo dans le `gatsby-config.js`.
    
Commandes de dump de la base locale

    sudo systemctl stop neo4j
    cd /var/lib/neo4j
    sudo -u neo4j neo4j-admin dump --database=neo4j --to=backups/maquisdoc/vx-xx.dump
    
Commandes pour transférer la base:  
localement : 

    scp /var/lib/neo4j/backups/maquisdoc/vx-xx.dump remy@188.226.151.10:/home/remy/dumps
    
sur le droplet dans le dossier de "remy":

    sudo systemctl stop neo4j
    sudo cp dumps/vx-xx.dump /var/lib/neo4j/backups/maquisdoc/vx-xx.dump 
    cd /var/lib/neo4j
    sudo chown neo4j:neo4j backups/maquisdoc/vx-xx.dump
    sudo -u neo4j neo4j-admin load --from=backups/maquisdoc/vx-xx.dump --database=neo4j --force
    sudo systemctl start neo4j
    
Commande pour "*tirer*" le serveur apollo sur le droplet

    cd maquisdoc-graphql
    git fetch origin main
    pm2 stop ecosystem.config.js
    pm2 start ecosystem.config.js
