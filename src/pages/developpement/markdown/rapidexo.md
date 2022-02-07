---
theme: "journal"
title: "application rapidexo"
date: "2021-10-31"
---
###1.  Présentation et organisation de l'application

Rapidexo permet de former des feuilles de 30 petits exercices techniques à partir d'une base d'exercices classés par thèmes.

L'utilisateur y accède par la page (Gatsby) de vue rapidexo.js qui exécute des requêtes vers un serveur Gunicorn + flask. Cet ensemble est un composant de l'application maquisdoc de Digital Ocean.  
Côté Gatsby, la dynamique de la page est gérée à l'aide d'états: `roleState`, `listeRefsState`, `pdfUrlState`, `numState`. 

1. Former une liste de références d'exercices
    * côté Gatsby. La fonction `themesINPUT` est renvoyée lorsque `roleState` vaut 0. Elle présente (fonction `fetchREFS`) un formulaire permettant de choisir un nombre d'exos pour chaque thème (30 tous thèmes confondus) et d'envoyer une requête sur le serveur Flask. La réponse modifie `roleState` qui passe à 1 et `listeRefsState` qui désigne la liste de chemins. 

    * côté Flask: route `/getREFS` avec les nombres d'exercices par thème en paramètre. Renvoie une liste de références d'exercices formée aléatoirement avec les nombres d'exercices de chaque type.

2. Visualisation des exercices.
    0. côté Gatsby. La fonction `listeMENU` est renvoyée lorsque `roleState` est >0 et présente les outils pour visualiser les exercices.
    1. compiler sur le serveur flask les deux pages pdf (énoncés, corrigés) contenant les exercices de la liste puis les télécharger.
        * compiler côté Gatsby: Lorsque `roleState` vaut 1, `compilBUTTON` est présenté qui permet d'appeler `fetchCOMPIL` qui lance une requête `POST`.
        * compiler côté Flask: La route `/getCOMPIL` reçoit la requête avec la liste des références dans son `body`. Elle compile la feuille puis  renvoie un identifiant du fichier pdf à télécharger et la valeur 2 à passer à `roleState`.
        * télécharger côté Gatsby. Lorsque `roleState` vaut 2, la fonction `pdfANCHOR` présente un lien de téléchargement (à la place du bouton de compilation) vers la route `/getPDF` (avec un pamamètre) du serveur Flask.
        * télécharger côté Gatsby. La route `/getPDF` renvoie le fichier pdf au navigateur et le supprime du dossier sur Flask.  
        ATTENTION si le lien n'est pas cliqué dans le navigateur le fichier ne sera pas supprimé sur le serveur Flask.
    2. lire les exos dans la vue
        * côté Gatsby: déplacement dans la liste des références, affichage énoncé, visualisation corrigé.  
        * côté Flask: route `/getLATEX` avec une référence d'énoncé ou de corrigé en paramètre. Renvoie le code Latex.


###2. Composants

Une fonction python qui renvoie une liste extraite aléatoirement:  random.sample(population, k, *, counts=None)

    Return a k length list of unique elements chosen from the population sequence or set. Used for random sampling without replacement.

    Returns a new list containing elements from the population while leaving the original population unchanged. The resulting list is in selection order so that all sub-slices will also be valid random samples. This allows raffle winners (the sample) to be partitioned into grand prize and second place winners (the subslices).
    
Voir aussi splice en javascript. 
    
Les textes des exercices sont accessibles dans un projet GitHub.

###3. Problèmes

Il faut actualiser les thèmes et il manque des exercices pour certains
  * Geomel: 29
  * Lineuc: 23
  * Systlin: 26
  
Les exercices `Ectrigus89`, `Ectrigus90`, `Ectrigus91` contiennent des images pdf créés avec asymptote. Je ne sais pas les compiler pour le moment. J'ai contourné le problème en les renommant `_Ectrigus89`, `_Ectrigus90`, `_Ectrigus91` de manière à ce qu'ils ne soient jamais tirés.

###4. Déploiement sur Digital Ocean

Référence : [How To Deploy a FlaskApp Using Gunicorn to App Platform](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-app-using-gunicorn-to-app-platform)
