---
theme: développement
title: Principes
rang: 1
---
### Principes
L'objectif du projet maquisdoc est d'organiser les documents pédagogiques d'un enseignant de manière à les **sauvegarder**, les **diffuser**, les **relier**. 

#### Organisation-Implémentation

**Sauvegarder**  
En arrière plan, les documents sources (essentiellement LateX) sont rassemblés en *dépôts* actuellement hébergés sur github.

**Diffuser**  
En arrière plan, les documents compilés sont hébergés et diffusés par des serveurs web statiques.  
En premier plan, le site maquisdoc lui même présente des *vues* partielles vers les documents. Il est écrit en javascript avec le framework Gatsby. 

**Relier**  
Le terme *maquis* fait référence à un graphe de données pédagogiques dont les documents sont des noeuds particuliers. Les *concepts* ou les *événements* sont d'autres types de noeuds.  
Il existe aussi plusieurs types d'arêtes comme *DOCUMENTE* ou *REQUIERT*. Par exemple "un noeud document *DOCUMENTE* un noeud concept" ou "un concept *REQUIERT* un autre concept".  
Cette base de données en graphe est mise en oeuvre et hébergée sur un serveur neo4j.


Toutes les sources (documents, outils d'organisation et de diffusion) doivent être accessibles et téléchargeables pour modification (licence CC).

Le projet ne s'intéresse pas à la gestion d'une classe ni à la monétisation des ressources. Pour autant, <em> de tels développements ne sont pas interdits. </em> 

#### Glossaire
* **document**: un document pédagogique du projet.
* **dépôt**: un dispositif organisé de stockage d'un ensemble de *documents*.
* **auteur**: une personne qui rédige des *documents* dans le cadre du projet.
* **développeur**: une personne qui code l'infrastructure informatique du projet.
* **utilisateur**: une personne qui cherche des *documents* pour travailler avec.
* **rédaction**: création ou modification d'un *document* dans un *dépôt*.
* **publication**: processus qui permet à tout *utilisateur* d'accéder à un *document*.
* **contextualisation** : processus qui permet de relier les *documents* entre eux.
* **maintenance** : actions à exécuter après une modification d'un *dépôt* pour conserver la cohérence du projet.

#### Cycle de travail d'un auteur (workflow) 
1. rédaction de *documents* avec les outils de son choix dans un *dépôt*.
2. *maintenance* du *dépôt*.  
Elle consiste à compiler et à placer les fichiers compilés dans les serveurs assignés ainsi qu'à mettre à jour la base de données en graphe.
