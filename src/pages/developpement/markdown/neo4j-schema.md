---
theme: "journal"
title: "neo4j: schéma"
date: "2020-12-03"
---

On souhaite définir un *schéma* pour la base neo4j. Un schéma pour la base est constitué par:

-   les labels et propriétés caractérisant les divers types noeuds
-   les labels des relations entre les divers types de noeuds.

La définition d'un schéma n'est pas nécessaire pour une base neo4j en soi mais elle l'est pour présenter les données dans une base graphql entre neo4j et gatsby.

Il faut commencer par modifier la structure des labels et propriétés héritées de l'importation depuis sql.

### 1. Situation initiale

Types de noeuds initiaux

| idtypeelt | typeelt | descript|
| ---- | ---- | ---- |
| 7 | mots (cours MPSI) | élément de cours. |
| 8 | lienweb | lien vers une page web |
| 9 | mots (devoirs MPSI) | noeud dans l'arbre d'accès aux devoirs |
| 10 | devoir | devoir de maths |
| 11 | date	| date |
| 12 | commentaire | tout type de commentaire |
| 13 | partiedevoir | problème de type partie de devoir |
| 16 | racine | un seul élément de ce type, la racine absolue du maquis documentaire. |
| 17 | noeudmaquis | tout ce qui n'entre pas dans les autres types |
| 18 | exercice (moyen) | exercices de type colle ou TP |
| 19 | matière | matière : math ou physique |
| 20 | liste exercices | liste d'exercices moyens |
| 21 | institutions | lycées, écoles d'ingénieurs, ... |
| 22 | niveau | niveau : mpsi, pcsi, termS, ... |
| 24 | type d'épreuve | type d'épreuve : dm, ds, concours d'entrée, ... |
| 26 | programme de colle | programme de colle |
| 27 | liste problèmes | liste de problèmes |
| 28 | livrepb | livre de problèmes |
| 29 | livreexos | livre d'exercices |
| 31 | lien commercial | lien commercial |
| 32 | livre | livre |
| 33 | competence | compétence |
| 34 | algoform | elt algorithmique et calcul formel |
| 35 | article_sc | article scientifique de journal, de revue ou de site |
| 36 | dossads | dossier ads |
| 37 | epreuve | épreuve de concours ou d'examen |


Types de relations initiales


|idtyperel | typerel	| description |
|--------- | ---------- | ----------  |
| 2        | speplancours| contient dans un plan ou dans un thésaurus |
| 3        | spedevoir | arbre d'accès aux devoirs | 
| 4	       | depotweb  | accès à une ressource web. |
| 5        | partie01  | contient comme Partie 1 l'élément |
| 14       | partie	   | contient (sans ordre) l'élément |
| 15       | qualifie  | apparait dans : mot clé -> elt documentaire |
| 16       | racination	| "racine absolue" -> les racines du maquis |
| 17       | spemaquis | tout ce qui n'entre pas dans les autres types de relations |
| 18       | commentaire | est commenté par | 
| 19  | question de cours | contient comme question de cours: programme de colle -> elt de cours |
| 20 | partie de colle | est une partie de colle de: élément de cours -> programme de colle |
| 21 | est utilisé par | est utilisé par : utilisation -> institution |
| 22 | est utilisé le | est utilisé le : utilisation -> date |
| 23 | porte sur | porte sur : pb ou exo -> elt de cours |
| 24 | est prérequis de	| est prérequis de : elt de cours -> elt de cours synonyme de "est nécessaire à" |
| 25 | intro | est introduit par | 
| 26 | descrpt | est décrit par |
| 27 | vendu par | est vendu par |
| 28 | citedans | est cité dans livre --> élément |

D'après le processus d'importation dans la base neo4j, chaque noeud est labellisé par une unique valeur (numérique) de `idtypeelt` et ils ont tous les mêmes propriétés:

    ideltdoc    nom             id_auteur_elt   date
    
De même, toutes les relations sont labellisées par les valeurs (numériques) de `idtyperel` et ont les mêmes propriétés

    idrel       chaine_date     idauteur

### 2. Évolution
#### Noeuds et relations.
Les labels numériques initiaux des noeuds et des relations sont chacun classés en deux catégories : "à remplacer", "à supprimer".

Pour chaque valeur `ie` de `idtypeelt`:

- "à remplacer". On lui associe une chaîne `s` qui sera le nouveau label. 
    + Pour chaque noeud `n` labellisé par `ie` on labellise `n` par `s`.
    + On conserve le label `ie` du noeud `n` pour complémenter les propriétés.
- "à supprimer". On lui associe des propriétés `p1,p2,...` attachées à un label `s` de noeud et à un label `ir` de relation.
    + Les noeuds `n` labellisés par `ie` doivent avoir une seule relation `r` avec un seul autre noeud `m` pour la relation associée. La relation `r` doit être labellisée par une valeur `ir` classée "à supprimer".
    + Pour chaque noeud `n`, on écrit les propriétés de `n` comme valeurs de `p1,p2,...` de `m`.
    + On supprime le noeud `n` et la relation `r`.

Pour chaque valeur `ir` de `idtyperel`,

- "à remplacer". On lui associe un chaine `c` qui sera le nouveau label.
    + Pour chaque relation `r` labellisée par `ir`, on labellise `r` par `c`.
    + On supprime le label `ir` de `r`.
- "à supprimer". En principe, les relations labellisées par `ir` ont déjà été supprimées par le traitement des noeuds.

### 3. Après le traitement

Tous les labels numériques ont été remplacés par des chaînes de caractères. La base est sauvegardée comme v1-0.dump

Le schéma de la base est précisé par les tableaux suivants.

Un seul label par noeud.


|Labels des noeuds | Description |
|-----             | -----       |
| `Concept`          | un concept dans le contexte d'une discipline |
| `Document`         | document pédagogique dont le type est caractérisé par la valeur de la propriété `typeDoc` |
| `Evenement`        | événement pédagogique dont le type est caractérisé par la valeur de la propriété `typeEvt` |
| `SiteWeb`          | sites scientifiques             |


Valeurs de `typeDoc` : cours, liste exercices, liste rapidexo, exercice, livre, livre problèmes, problème, programme, sujet dossier ADS, article scientifique.

Valeurs de `typeEvt` : question de cours , DM, DS

*****


Propriétés des noeuds avec les labels des noeuds qui *peuvent* avoir chaque propriété.  
</br>

|Propriété | Description | Labels |
|----------|------------ |--------|
|`annéeEvt` |  | `Evenement` |
|`date` | héritée, date de l'insertion du noeud | tous |
|`description`  | texte descriptif | tous |
|`discipline` | mathématiques, informatique, ... | tous |
|`ideltdoc` | héritée de maquisdoc | tous |
|`litteral` | chaîne de caractère désignant le concept | `Concept` |
|`nom` | obligatoire | `Evenement`, `SiteWeb` |
|`titre` | obligatoire | `Document` |
|`typeDoc` | type de document | `Document` |
|`typeEvt` | type d'événement | `Evenement` |
|`typeSiteWeb` | type de site | SiteWeb |
|`url` | url du document (pdf) | `Document` |
|`urlCorr` | url du corrigé (pdf)| `Document` |
|`urlEnon` | url de l'énoncé (pdf) | `Document` |
|`urlSrc` | url de la source (lateX, ...) | `Document` |
|`urlSrcCorr` | url de la source du corrigé | `Document` |
|`urlSrcEnon` | url de la source de l'énoncé | `Document` |
|`urlSrcMaple` | url dela source Maple (héritée) | `Document` |

----

Description des relations


| Relation | description/exemple |
|----------|-------------|
| APPARAIT_DANS | un concept APPARAIT_DANS un autre concept |
| CONTIENT | un document CONTIENT un sous-document, un concept CONTIENT un sous-concept |
| DOCUMENTE | un document DOCUMENTE un concept |
| INTERVIENT_DANS | un concept INTERVIENT_DANS un document. Ce concept est une *clé* du document.|
| REQUIERT | un document ou un concept REQUIERT un autre concept pour être compris oumaitrisé |
| REFERENCE | un document REFERENCE un autre document au sens d'une référence bibliographique |
| SPECIALISE | un concept SPECIALISE un autre concept c'est à dire qu'il en est un cas particulier ouun exemple |
| UTILISE | un événement UTILISE un document comme support: un document de cours, un énoncé, ... |
| EVALUE | un événement ou certains documents (exercice, devoir) EVALUE un concept |

Les tableaux suivant indiquent les labels que doivent avoir les noeuds reliés par une relation d'un certain type.

Si le label du premier noeud est `Document`: 

    MATCH (e:Document)-[r]->(n) RETURN DISTINCT type(r),labels(n)
 
|	`type(r)`	| `labels(n)` |
|-----------|----------|
| `DOCUMENTE` |	 `Concept` |
| `EVALUE` |	 `Concept` |
| `CONTIENT` |	 `Document` |
| `REFERENCE` |	 `Document` |

----

Si le label du premier noeud est `Concept`:

    MATCH (e:Concept)-[r]->(n) RETURN DISTINCT type(r),labels(n)
    
|	`type(r)`	| `labels(n)`|
|-----------|----------|
| `APPARAIT_DANS` |	 `Concept` |
| `SPECIALISE` |	 `Concept` |
| `CONTIENT` |	 `Concept` |
| `REQUIERT` |	 `Concept` |
| `INTERVIENT_DANS` |	 `Document` |

----

Si le label du premier noeud est `Evenement`:
    
    MATCH (e:Événement)-[r]->(n) RETURN DISTINCT type(r),labels(n)

|	`type(r)`	| `labels(n)` |
|-----------|----------|
| `EVALUE` | `Concept` |
| `UTILISE` | `Document` |
| `CONTIENT` | `Evenement` |


----------------

Des requêtes qui me semblent utiles dans ce contexte pour valider les couples (label, propriété)
    
    MATCH (n )
    WHERE exists(n.description)
    WITH labels(n) as listlab
    UNWIND listlab as label
    RETURN DISTINCT label
    
    
    MATCH (n :Document)
    WHERE exists(n.description)
    WITH keys(n) as listprop
    UNWIND listprop as props
    RETURN DISTINCT props

    
La vérification de la pertinence de la base avec ce schéma a conduit à des modifications. La première base cohérente avec ce schéma est sauvegardée en v1-1.dump
