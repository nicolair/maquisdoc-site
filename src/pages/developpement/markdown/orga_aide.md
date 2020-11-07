---
theme: "journal"
title: "Organisation des informations de développement"
date: "2020-11-06"
---

Les informations concernant le développement du projet sont rédigées au format markdown (suffixe .md).

Elles sont stockées dans le dossier /src/pages/markdown.

Lors de la phase de construction, Gatsby crée des pages à partir de ces fichiers. 

Les premières lignes d'un fichier md sont encadrées par des lignes formées de 3 tirets "---". Elles constituent le "frontmatter" du fichier.
La page est créée à partir de modèles différents (templates) suivant le thème indiqué dans le frontmatter.
