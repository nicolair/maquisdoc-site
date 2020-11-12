---
theme: développement
title: Site web - vues
rang: 4
---
### Site web
Le code du site est [disponible](https://github.com/nicolair/maquisdoc-site) sur GitHub.

Le site est codé avec Gatsby qui est un *générateur de site statique*. Il utilise une forme particulière de javascript spécifique à React.

Le site contient deux parties.
* La branche **Développement** qui présente la documentation sur le projet. Elle est formée par 
    - des documents au format Markdown (.md) qui sont transformés en pages html par Gatsby
    - des pages générées par les outils de documentation des script python (pydoc) ou javascript
* Les **Vues** présentent les documents. Une vue se limite à une partie des documents et possède sa logique de présentation.

La seule vue disponible actuellement est *Exercices* qui présente les exercices à travers des feuilles. Elle exploite un seul dépôt dont les éléments sont structurés en thèmes. La vue reflète cette structure par l'intermédiaire du fichier /src/pages/_codes.csv qui associe le code (règle de nommage) à la description du thème.<br/>
Les documents compilés à publier (feuilles d'exercices en pdf) sont uploadés sur un espace DigitalOcean. Le site connait les règles de nommage de ces documents à partir du code du thème et peut donc attacher l'url d'un document au code d'un thème d'exercice.

Remarques<br/>
* Le manifeste d'un dépôt doit présenter les règles de nommage des documents à diffuser.
* Le fait que la vue s'appuie sur un fichier .csv montre bien qu'une base de données est indispensable pour former des vues moins naives. La première version de maquisdoc utilisait une base de données mysql. Celle ci veut utiliser une base de données en graphe (neo4j). Il est urgent de la mettre en oeuvre. 
