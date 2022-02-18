---
theme: "journal"
title: "vue rapidexo"
date: "2022-02-18"
---

La vue Rapidexo est une application qui permet de former des feuilles de 30 petits exercices techniques à partir d'une base d'exercices classés par thèmes.

L'utilisateur choisit un nombre d'exercices pour les thèmes proposés (le nombre total doit être 30). L'application renvoie des exercices aléatoires pour chaque thème. L'utilisateur peut télécharger au format pdf la feuille complète des énoncés ou des corrigés. Il peut aussi naviguer directement entre les énoncés.

###1.  Organisation
Le fichier principal est la page rapidexo.js de l'application React-Gatsby. Des requêtes sont effectuées vers un serveur Gunicorn-Flask, vers le serveur GitHub qui contient les sources et vers un serveur latexOnline qui effectue la compilation LateX comme un service.  
Côté React-Gatsby, la dynamique de la page est gérée à l'aide d'états en utilisant le *"hook"* `useState`. 

1. Former une liste de références d'exercices
    * côté Gatsby. La fonction `themesINPUT` est renvoyée lorsque `roleState` vaut 0. Elle présente (fonction `fetchREFS`) un formulaire permettant de choisir un nombre d'exos pour chaque thème et d'envoyer une requête sur le serveur Gunicorn-Flask. La réponse modifie `roleState` qui passe à 1 et `listeRefsState` qui désigne la liste de chemins. 

    * côté Flask: route `/getREFS` avec les nombres d'exercices par thème en paramètre. Renvoie une liste de références d'exercices formée aléatoirement avec les nombres d'exercices de chaque type.

2. Visualisation des exercices.
    1. côté Gatsby. La fonction `listeMENU` est renvoyée lorsque `roleState` est >0 et présente les outils pour visualiser les exercices.
    2. compiler les pages pdf (énoncés, corrigés) et proposer un lien de téléchargement.
        * compiler côté Gatsby: Lorsque `roleState` vaut 1, `compilBUTTON` est présenté qui permet d'appeler `fetchCOMPIL` qui lance une requête `POST`.
        * compiler côté Flask: La route `/getCOMPIL` reçoit la requête avec la liste des références dans son `body`. Elle forme le fichier LateX que le serveur web Gunicorn présente. Elle renvoie un identifiant du fichier LateX et la valeur 2 à passer à `roleState`.
        * télécharger côté Gatsby. Lorsque `roleState` vaut 2, la fonction `pdfANCHOR` présente un lien de téléchargement (à la place du bouton de compilation) vers le service de compilation en ligne.
  
    3. lire les exos dans la vue
        * côté Flask: route `/getLATEX` avec une référence d'énoncé ou de corrigé en paramètre. Renvoie le code Latex à passer au `latexState`.  
        * côté Gatsby: déplacement dans la liste des références, affichage énoncée en traitant le `latexState` avec un composant spécifique basé sur `katex`.

        ATTENTION un mécanisme de suppression du fichier Latex sur le serveur Gunicorn est indispensable.
        
###2. Remarques

Le serveur Flask utilise  `random.sample(population, k, *, counts=None)`
qui renvoie une liste extraite aléatoirement:
    
Les textes des exercices sont accessibles dans un projet GitHub.

Il faut actualiser les thèmes et il manque des exercices pour certains
  * Geomel: 29
  * Lineuc: 23
  * Systlin: 26
  
Les exercices `Ectrigus89`, `Ectrigus90`, `Ectrigus91` contiennent des images pdf créés avec asymptote. Je ne sais pas les compiler pour le moment. J'ai contourné le problème en les renommant `_Ectrigus89`, `_Ectrigus90`, `_Ectrigus91` de manière à ce qu'ils ne soient jamais tirés.

Le composant basé sur katex ne fonctionne bien qu'avec les expressions mathématiques de Latex: le formatage textuel est ignoré. Il faut transformer *à la main* les tags LateX en tags html.


Déploiement sur Digital Ocean

Référence : [How To Deploy a FlaskApp Using Gunicorn to App Platform](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-app-using-gunicorn-to-app-platform)
