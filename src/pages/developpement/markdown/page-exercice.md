---
theme: "journal"
title: "pages 'Exercice'"
date: "2022-04-03"
---
Une page 'Exercice' présente des informations sur un exercice particulier notemment le texte compilé en html.  
Elles sont statiques (crées au moment de la construction "*build time*" à partir des noeuds labellisés `Document` dont la propriété `typeDoc` est 'exercice'.  
Du côté Gatsby, les éléments importants sont

- la fonction `lexercices` dans `gatsby-node.js` qui extrait et liste les documents 'exercice' et crée les pages à partir d'un modèle.

- le modèle  `exercice-page.js` dans `templates`.

Compilation en html. Diffusion sur un espace
