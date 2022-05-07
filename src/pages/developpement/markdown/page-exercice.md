---
theme: "journal"
title: "pages 'Exercice'"
date: "2022-05-07"
---
Les pages 'Vue d'un exercice' présentent des informations sur un exercice particulier notemment le texte compilé en html et un lien vers la source LateX.  
Elles sont statiques (crées au moment de la construction ("*build time*") à partir des noeuds de la base en graphe labellisés `Document` dont la propriété `typeDoc` est 'exercice' mais l'image html de l'exercice est présentée à l'aide d'un lien dans un "*frame*". On peut changer le texte de l'exercice sans reconstruire le site complet.  

Du côté Gatsby, les éléments importants sont

- la fonction `lexercices` dans `gatsby-node.js` qui extrait et liste les documents 'exercice' et crée les pages à partir d'un modèle.

- le modèle  `exercice-page.js` dans `templates`.

Lors de la maintenance du dépôt d'exercices,  Le Latex est compilé en html par `make4ht` et les fichiers images sont uploadés sur un espace.  

En ce qui concerne la base en graphe, les exercices (`:Document {typeDoc:"exercice"}`) sont regroupés en feuilles (`:Document {typeDoc:"feuille exercices"}`) qui évaluent (`[EVALUE]`) le même concept. Une feuille est reliée aux exercices qu'elle contient par la relation `[CONTIENT]`.
