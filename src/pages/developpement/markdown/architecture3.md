---
theme: "journal"
title: "architecture 3: serveurs, environnements"
date: "2021-11-27"
---
La plateforme est constituée de plusieurs serveurs qui communiquent entre eux. Cet article fait le point sur leurs configurations et la manière d'implanter les données qui permettent ces connexions.

#### 1. Serveurs

| serveur | dev. host   | prod. host    | rôle                              |
| :----   | :---------: |:------------: | :-------------------------------- |
| Gatsby  | local       | comp. app. DO  `maquisdoc-site` | front: office principal |
| GraphQl | local       | comp. app. DO `maquisdoc-graphql` | intermédiaire: interface graphql-neo4j |
| Neo4j   | Aura        | Aura          | back: base de donnée en graphe neo4j |
| Flask   | local       | comp. app. DO `maquisdoc-rapidexo` | intermédiaire: interface avec les repos GitHub |
| GitHub   | GitHub     | GitHub | back: repos pour les scripts et les sources LateX |

L'abbréviation "comp. app. DO" signifie qu'il s'agit d'un composant de l'application `maquisdoc-site` sur Digital Ocean.   
On peut remarquer que, en production, tous les serveurs ("front" et "intermédiaires") qui forment des requêtes vers d'autres serveurs sont des composants de l'application sur Digital Ocean. Ce sont ces serveurs qui ont besoin des données de connexion.
 
 À la suite d'une mise à jour du paquetage fedora, le serveur neo4j de développement ne démarre plus correctement sur une machine sous fedora. 
 Je l'ai remplacé par un serveur distant Aura utilisé aussi en production et créé à partir d'une sauvegarde. Il n'y a plus de serveur neo4j de développement, il convient de procéder à des backups de la base en ligne. Il suffit de modifier les variables d'environnement utilisées par le serveur graphql apollo.

 #### 2. Données de connexion.
 Elles sont formées des url et des credentials et sont passées aux serveurs intermédiaires avec des variables d'environnement.
 
 | variables | implantation dans l'environnement de | rôle |
 | :-------- | :-----------:| :----- |
 | `NEO4J_URL`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` | GraphQl | credentials serveur neo4j |
 | `MQD_GRAPHQL_SERVER_URL` | Gatsby | URL serveur graphql |
 | `GITHUB_TOKEN`, `GITHUB_USER` | Flask | credentials for GitHub repos |
 | `FLASK_ENV`, `FLASK_APP`| Flask | configuration du serveur flask |

 #### 3. Implantation des variables d'environnement
 En développement, comme tous les serveurs intermédiaires sont implantés sur la machine de travail locale, les variables sont exportées (à partir du fichier `~/.bashrc`) dès le login vers les processus engendrant les serveurs.  
 
En production, les variables sont implantées au niveau supérieur dans l'environnement de l'application (`APP-LEVEL VARIABLES`) plutôt que dans les environnements des composants. On les édite dans l'interface Digital Ocean avec l'onglet `settings` de l'application. 
