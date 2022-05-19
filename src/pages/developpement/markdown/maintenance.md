---
theme: développement
title: Maintenance
rang: 3
---
### Maintenance d'un dépôt
Un dépôt est un dossier (système de fichiers) local personnel à un auteur. Certains de ces fichiers sont des sources traitées par divers scripts de *compilation* (Latex, Asymptote, Python) et d'autes des images ou des produits annexes des compilations.  
Des aspects du dépôt sont présentés sur des serveurs web accessibles à tous (GitHub, espace de diffusion, base de données en graphe).  
Un dépôt étant modifié par le travail local de l'auteur, il s'agit de maintenir sa cohérence avec les reflets distants diffusés.


Des **conventions de nommage** sont fixées pour divers types de fichiers. Elles sont repèrées par des expressions régulières auxquelles sont associées des scripts de maintenance.  
La maintenance consiste donc à scanner les fichiers et exécuter les scripts pour ceux qui vérifient les expressiosn régulières. 


Les dépôts actuels sont structurés par:
* stockage: système de fichiers
* outils: Latex, Asymptote, Python

La maintenance s'effectue à l'aide de scripts python locaux. Elle doit effectuer
1. Compilations: à partir des sources .tex .asy .py création des documents et figures en pdf. La difficulté est de ne compiler que ce qui mérite de l'être.
2. Diffusions:
    * sources: sur dépôt GitHub distant
    * documents: sur espace DigitalOcean
3. Contextualisation dans la base neo4j

Les script de maintenance sont rassemblés dans le dépot [mtn-dpt](https://github.com/nicolair/mtn_dpt) de GitHub.

La documentation sur les scripts de maintenance est générée par pydoc. 
- liste des sources à documenter:
    1. maintenance.py
    2. depot.py
    3. execlocal.py
    4. scantex.py
    5. espace.py
- pour chaque nom dans la liste des sources, 
    pydoc -w nom génère la page html de documentation pour le nom. Cette page comprend des liens vers d'autres pages de documentation.
