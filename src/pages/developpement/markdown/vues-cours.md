---
theme: "journal"
title: "vues relatives aux documents de cours"
date: "2021-02-18"
---
Ces vues sont analogues à celles pour les problèmes.

* une vue principale de la liste alphabétique des textes de cours
* une vue de recherche de chaine de caractère
* une vue par document du détail des relations dans le maquis.

La requête

    searchcours (mot:String): [Document] @cypher(statement: """
      CALL db.index.fulltext.queryNodes("TitresEtDescriptions", $mot)
        YIELD node, score
      WHERE node.typeDoc = "cours"
      RETURN  node
    """),
    
a été ajoutée au schéma du serveur Apollo. On pourrait la regrouper avec `searchpbs` en utilisant un deuxième paramètre pour le type de document.
