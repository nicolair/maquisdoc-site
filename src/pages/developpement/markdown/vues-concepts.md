---
theme: "journal"
title: "vue 'Concepts'"
date: "2021-02-20"
---
Un "`Concept`" est un type de noeud du maquis qui représente un concept relatif à une discipline (mathématique, informatique). Il est caractérisé par une chaîne de caractère: son "*litteral*". Dans maquisdoc, les autres types de noeuds sont "`Document`", "`Evenement`" et "`SiteWeb`" (voir la page [neo4j: schéma](https://maquisdoc-site-rpz2m.ondigitalocean.app/developpement/markdown/neo4j-schema/) du journal de développement).


L'organisation des vues des concepts est la même que pour les textes de problèmes ou de cours (type `Document`). 

* une vue principale de la liste alphabétique des littéraux
* une vue de recherche de chaine de caractère
* une vue détaillée d'un concept.

Les vues de liste et de recherche sont analogues à celles déja écrites pour les types de `Document` précédents (`problèmes` et `cours`).

### 1. Vue détaillée, vue de voisinage 

Tous les noeuds du maquis sont reliés à d'autres par des relations de divers types. Dans l'état actuel, ces relations sont plus riches pour les "`Concept`" que pour les "`Document`".  La vue détaillée d'un concept présente ses relations avec les liens vers les noeuds associés.

En fait c'est la cas pour les vues détaillées de tous les types de noeuds, il s'agit toujours de présenter dans une page un sous-graphe qui est le *voisinage* du noeud considéré et cette page doit permettre de se déplacer dans le graphe.


Ces *pages* de voisinage (ou de détail d'un noeud) sont formées par le script `gatsby-node.js` lors de la phase de construction par Gatsby.  Attention au terme *noeud*, il ne s'agit pas seulement des noeuds du maquis neo4j mais de ceux du graphe graphql englobant la maquis. Par exemple, cette page-ci est générée à partir d'un fichier markdown qui est un noeud graphql mais **pas un noeud du maquis**.  
Un point important à améliorer encore est de concevoir clairement quels sont les noeuds qui "*méritent*" d'avoir leur propre page détaillée de façon à organiser le plus clairement possible la création des pages par `gatsby-node.js`. En ce qui concerne les `Document`, pour le moment, des pages *par défaut* sont créees pour les types (`typeDoc`) de la liste suivante (tous sauf `cours` et `problème`)

    ["liste exercices","liste rapidexo", "exercice", "livre problèmes",
    "livre", "programme", "sujet dossier ADS","article scientifique"]

Le "*slug*" d'une page est son url relative dans le site Gatsby. La convention de nommage utilisée actuellement est présentée dans le tableau suivant

| Type de noeud | Slug |
| ------------- | ---- |
| texte de cours | `document_id`    |
| texte de problème | `document_id`   |
| Document          |`document_id`    |
| Concept           | `concept_id`    |
| semaine           | `semaine_no`    |

où `id` est l'identifiant unique du noeud dans la base neo4j et `no` est le numéro de la semaine. 

### 2. Requêtes de voisinage

La requête cypher fondamentale pour récuperer les données de voisinage des concepts est   

    MATCH (c:Concept)-[r]-(n)
    RETURN c.litteral,type(r),id(startNode(r))=id(c) AS FROM , n
    
Le schéma du serveur Apollo est modifié pour intégrer le type `Concept` qui contient des champs "`documentsvoisins`" et "`conceptsvoisins`" ?.

    type DocumentVoisin {
      typeRel: String
      out: Boolean
      docType: String
      docTitre: String
      docDescription: String
      docUrl: String
      docId: ID!
    }
    
    type ConceptVoisin{
      typeRel: String
      out: Boolean
      conceptLitteral: String
      conceptDescription: String
      conceptId: ID!
    }
    
    type Concept {
      litteral: String
      discipline : String
      description: String
      _id: ID!
      documentsvoisins: DocumentVoisin @cypher(statement: """ 
        MATCH (this:Concept)-[r]-(d:Document)
        WITH {
           typeRel: type(r) ,
           out: id(endNode(r))=id(d) ,
           docType : d.typeDoc ,
           docTitre: d.titre ,
           docDescription: d.description,
           docUrl: d.url
           docId: id(d)
        } AS DocumentVoisin
        RETURN DocumentVoisin
      """)
      conceptsvoisins: ConceptVoisin @cypher(statement: """ 
        MATCH (this:Concept)-[r]-(c:Concept)
        WITH {
           typeRel: type(r) ,
           out: id(endNode(r))=id(c) ,
           conceptLitteral : c.litteral ,
           conceptDescription: c.description
           conceptId: id(c)
        } AS ConceptVoisin
        RETURN ConceptVoisin
      """)
    }

### 3. Recherche de chaine de caratère

On procède comme pour les [problèmes](https://maquisdoc-site-rpz2m.ondigitalocean.app/developpement/markdown/vue-problemes/) en créant d'abord un nouvel index dans neo4j.

On crée dans neo4j un index des littéraux et des descriptions pour tous les concepts par la commande cypher

    CALL db.index.fulltext.createNodeIndex("LittérauxEtDescriptions",["Concept"],["litteral","description"])

On cherche alors le mot "Gauss" avec:

    CALL db.index.fulltext.queryNodes("LittérauxEtDescriptions","Gauss")
      YIELD node, score
    RETURN node.litteral, node.description, node.url, score
    
On peut utiliser un paramètre dans la requête

    CALL db.index.fulltext.queryNodes("LittérauxEtDescriptions",$mot)
      YIELD node, score
    RETURN node.litteral, node.description, node.url, score

le paramètre a été défini dans le browser par `:param mot=> "gau*"`. Le caractère "`*`" est une wildcard pour chercher tous les mots qui commencent par `gau`.

Le schéma du serveur apollo est modifié pour introduire la requete `searchconcepts`
### 4. Questions diverses

Il apparait que certains couples de noeuds ont plusieurs relations entre eux; par exemple une `SPECIALISE` et une `APPARAIT_DANS`. Que faire ?

Problème de style, la liste des vues déborde sur le footer, introduire un espacement vertical.
