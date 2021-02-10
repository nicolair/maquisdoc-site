---
theme: "journal"
title: "nouvelle architecture"
date: "2021-02-09"
---
### 1. Défaut de la première architecture
L'implémentation d'une recherche de chaine de caractère dans le nom et la description des problèmes a mis a jour un problème sérieux dans l'architecture de déploiement.

Cette architecture comporte 3 composantes:

* le "front-end" est un site statique construit par Gatsby,
* le "back-end" est un serveur neo4j de base de données en graphe,
* au milieu un serveur apollo présente au front-end une API graphql qui interface la base de données. 

Dans l'environnement de développement, les 3 sont implantées sur ma machine locale de travail.  
Dans l'environnement "de production" (déploiement cloud) le site Gatsby est une application Digital Ocean (implantée dans un container minimal que je ne gère pas). Les deux autres serveurs sont implantés dans un droplet Digital Ocean qui est une machine virtuelle hébergée que je gère complètement (qui est très semblable à ma machine de travail).

Après les ajouts nécessaires à la recherche, tout fonctionne en développement. En production, tout se construit sans erreur et le site fonctionne sauf la recherche d'une chaine de caractère qui ne renvoie jamais rien.

En fait, c'est le navigateur qui bloque le résultat de la requête pour des raisons de sécurité. En effet les données sont obtenues par une requête au serveur graphql intermédiaire mais cette requête se fait avec le protocole http alors l'accès au front-end se fait avec https.

Pourquoi le reste du site fonctionne-t-il normalement?

Parce qu'il est *statique*. Les pages sont fabriquées par Node et React *au moment de la construction* avec les données obtenues par http. Le protocole http n'est pas obsolète pour lui même; les navigateurs le bloque dans les contextes qu'ils estiment dangereux. 

Lorsque le site est complètement statique, les seules requêtes se font au moment de la construction, le navigateur n'intervient pas. En revanche, avec le formulaire de recherche, c'est l'utilisateur donc le navigateur qui déclenche la requête http au serveur graphql.  
En developpement, le navigateur l'accepte par dérogation à l'interdiction générale parce que tous les urls sont en `http://localhost`.

### 2. Solution
Je n'ai pas compris, avec la documentation de Apollo serveur, comment implémenter une couche ssl. Je me suis donc orienté vers une solution qui me semble plus conforme aux pratiques actuelles de *conteneurisation*.

Le serveur Apollo est maintenant aussi une application Digital Ocean. C'est un sercice web qui est un composant de la première application Gatsby. Les deux services partagent des variables d'environnement, ils sont déployés **avec la couche ssl** et accessibles par `https`. Dans ces conditions, la recherche fonctionne.

À plus long terme, je pense qu'il faudrait aussi placer le serveur neo4j lui même dans un conteneur plutôt que dans une machine virtuelle complète. Cela permetttrait de profiter de la possibilité proposée par Digital Ocean d'augmenter les ressources du serveur.

Digital Ocean est une société commerciale et ses services sont payants. Comme j'accepte de payer pour des machines physiques ou virtuelles, je me fais à l'idée de payer seulement pour le service qu'elles rendent.

