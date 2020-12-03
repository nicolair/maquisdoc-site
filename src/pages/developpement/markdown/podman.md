---
theme: "journal"
title: "Conteneur - Podman"
date: "2020-11-13"
---

Il semblerait que l'outil de conteneur Podman soit meilleur que Docker.

J'ai donc 
 -  installé Podman en local
 -  tiré l'image de neo4j
 
 un problème de permission sur un dossier de données local survient. Il semble être lié à [selinux](https://github.com/containers/podman/issues/3683) 
