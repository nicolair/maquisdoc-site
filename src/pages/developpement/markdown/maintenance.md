---
theme: développement
title: Maintenance
rang: 3
---
### Maintenance d'un dépôt

Les dépôts actuels sont structurés par:
* stockage: système de fichiers
* outils: Latex, Asymptote, Python

La maintenance s'effectue à l'aide de scripts python locaux. Elle doit effectuer
1. Compilations: à partir des sources .tex .asy .py création des documents et figures en pdf. La difficulté est de ne compiler que ce qui mérite de l'être.
2. Diffusions:
    * sources: sur dépôt GitHub distant
    * documents: sur espace DigitalOcean

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
