---
theme: "journal"
title: "neo4j: importation"
date: "2020-11-22"
---

## Importation de la base maquisdoc dans neo4j

[Référence](https://neo4j.com/docs/operations-manual/current/tools/import/syntax/)

### Tables à importer

- auteurs ?
- eltsdocs
- liens_commerciaux ?
- relations
- semaines ?
- typerel
- typeselts
- tmots ? 652 mots en général en anglais. Parmi les éléments, il existe untype mot contenant 419 mots (tous en français il semble)
- tparentes_mots ? 176 relations, les relations ne sont pas qualifiées

### Examen des tables

#### table `typeselts`: 
26 types d'éléments. 
Requête pour examiner la table:

    SELECT typeselts.*, COUNT(*) AS Nb_elts 
      FROM `typeselts` JOIN eltsdocs ON typeselts.`idtypeelt` = eltsdocs.idtypeelt 
      GROUP BY typeselts.`idtypeelt` 
      ORDER BY Nb_elts DESC 

Résultat de la requête: fichier `typeselts.csv`

    idtypeelt,typeelt,couleur,descript,Nb_elts
    8,lienweb,#4A4AA5,lien vers une page web,3824
    18,exercice (moyen),#000000,exercices de type colle ou TP,1168
    10,devoir,#B47F0E,devoir de maths,514
    12,commentaire,#FF4B2F,tout type de commentaire,492
    13,partiedevoir,#B4B40E,problème de type partie de devoir,440
    7,mots (cours MPSI),#ADAD0C,élément de cours.,419
    37,epreuve,#B4230D,épreuve de concours ou d'examen,370
    20,liste exercices,#729A6E,liste d'exercices moyens,71
    34,algoform,#AD830E, elt algorithmique et calcul formel,65
    36,dossads,#95B40B,dossier ads,60
    35,article_sc,#6D9A8C,"article de journal, de revue ou de site",55
    9,mots (devoirs MPSI),#AD7411,noeud dans l'arbre d'accès aux devoirs,42
    31,lien commercial,#AEA942,chaine html d'un lien commercial,32
    26,programme de colle,#228F6E,programme de colle,31
    17,noeudmaquis,#E0D506,tout ce qui n'entre pas dans les autres types,25
    32,livre,#729A6E,livre,25
    11,date,#A5C6FF,date,13
    19,matière,#E7C21F,matière : math ou physique,8
    27,liste problèmes,#729A6E,liste de problèmes,5
    22,niveau,#E7650E,"niveau : mpsi, pcsi, termS, ...",5
    28,livrepb,#729A6E,livre de problèmes,4
    24,type d'épreuve,#76A3B4,"type d'épreuve : dm, ds, concours d'entrée, ...",3
    21,institutions,#D3E71F,"lycées, écoles d'ingénieurs, ...",3
    33,competence,#000000,compétence,2
    16,racine,#E52A40,"un seul élément de ce type, la racine absolue du maquis documentaire.",1
    29,livreexos,#729A6E,livre d'exercices,1

#### table `typerel`
19 types de relations. Requête pour examiner la table:

    SELECT `typerel`.*, COUNT(*) AS Nb_rel FROM `typerel` 
      JOIN relations ON typerel.idtyperel = relations.idtyperel
      GROUP BY typerel.idtyperel
      ORDER By Nb_rel DESC

Résultat de la requête : fichier `typerel.csv`

    "idtyperel","typerel","couleur","description","Nb_rel"
    "4","depotweb","#37377B","accès à une ressource web.","3764"
    "23","porte sur","#7CB49C","porte sur : pb ou exo -> elt de cours","1716"
    "5","partie01","#8A8A0B","contient comme Partie 1 l'élément","972"
    "26","descrpt","#7CB2B4","est décrit par ","690"
    "3","spedevoir","#885B0D","arbre d'accès aux devoirs ","555"
    "14","partie","#8A8A0B","contient (sans ordre) l'élément","370"
    "21","est utilisé par","#971D0B","est utilisé par : utilisation -> institution","370"
    "22","est utilisé le","#7F98C4","est utilisé le : utilisation -> date","370"
    "2","speplancours","#378A2C","contient dans un plan ou dans un thésaurus","359"
    "15","qualifie","#E6CB00","apparait dans : mot clé -> elt documentaire","288"
    "17","spemaquis","#B9B005","tout ce qui n'entre pas dans les autres types de relations","102"
    "28","citedans","#FFA500","est cité dans livre --> élément","93"
    "20","partie de colle","#276D49","est une partie de colle de: élément de cours -> programme de colle","79"
    "19","question de cours","#7A9E32","contient comme question de cours: programme de colle -> elt de cours","67"
    "27","vendu par","#DED754","est vendu par ","30"
    "24","est prérequis de","#FFA500","est prérequis de : elt de cours -> elt de cours synomyme de ""est nécessaire à"" ","11"
    "16","racination","#BB2234","""racine absolue"" -> les racines du maquis","6"
    "18","commentaire","#D33E27","est commenté par ","1"
    "25","intro","#000000","est introduit par ","1"
    
Remarque. On peur paramétrer dans mariadb l'exportation du résultat de la requête dans un fichier csv sans que les valeur des colonnes soient entourées de `" "`. C'est mieux pour l'imporation dans neo4j.

#### table `eltsdocs`
7678 éléments documentaires. Requête pour examiner la table

    SELECT * FROM `eltsdocs`

Le résultat est trop grand pour être présenté ici: fichier `eltsdocs_ori.csv`. Les premières lignes sont

    "ideltdoc","nom","idtypeelt","id_auteur_elt","date"
    "2","Devoirs (maths MPSI B)","9","1","0000-00-00 00:00:00"
    "3","Devoirs maison","9","1","0000-00-00 00:00:00"
    "4","Devoirs surveillés","9","1","0000-00-00 00:00:00"
    "5","DM 2000-2001","9","1","0000-00-00 00:00:00"
    "6","DM 2001-2002","9","1","0000-00-00 00:00:00"

#### table `relations`
9844 relations. Requête pour examiner la table:

    SELECT * FROM `relations`
    
Le résultat est trop grand pour être présenté ici: fichier `relations_ori.csv`. Les premières lignes sont

    "idrel","ideltdocparent","ideltdocenfant","idtyperel","idauteur","date"
    "2810","2","3","3","1","0000-00-00 00:00:00"
    "2811","2","4","3","1","0000-00-00 00:00:00"
    "2812","3","5","3","1","0000-00-00 00:00:00"
    "2813","3","6","3","1","0000-00-00 00:00:00"
    "2814","3","7","3","1","0000-00-00 00:00:00"
    "2815","3","8","3","1","0000-00-00 00:00:00"

## Principes de l'importation

L'importation se fait avec des couples de fichiers (nomfic_header.csv, nomfic.csv) attachés à des noeuds ou à des relations. 

1. Examen des 4 tables `typeselts`, `typerel`, `eltsdocs`, `relations` en ouvrant une base de travail dans mariadb et former des requêtes pour aider à former les fichiers à importer dans neo4j.
2. Formation des fichiers d'importation en exportant au format .csv les résultats de requêtes dans mariadb.

L'examen des tables conduit à se limiter à `eltsdocs` et `relations`.

## Formation des fichiers d'importation

4 fichiers à créer: les 2 premiers pour les noeuds, les 2 derniers pour les relations

- `eltsdocs_header.csv`, `eltsdocs.csv`
- `relations_header.csv`, `relations.csv`

Attention au fichiers csv exportés.

-   mariadb exporte en csv en ajoutant des "" autour des colonnes
-   neo4j importe les valeurs avec des "" comme des chaines de caractères ce qui conduit à une erreur si un autre type de champ est spécifié (en particulier date). En fait non l'erreur vient de la différence entre les formats de date de mariadb et de neo4j.
-   l'encodage des éléments documentaires est inconsistant. On trouve à la fois de l'iso et de l'utf-8. 

Pré-traitement.

-   Substitution dans kwrite les doubles caractères incohérents avec les é, è, ê, à, ô, ... correspondants.
-   Élimination des `"` en paramétrant correctement l'exporation csv ou avec le script python suivant:

    import csv
    
    nomfic = 'relations'
    nomnewfic = nomfic + '_new'
    
    nomfic += '.csv'
    nomnewfic += '.csv'
    titi = []
    
    with open(nomfic, newline='', encoding='utf-8' )as csvfile:
        riri = csv.reader(csvfile, delimiter=',')
        for row in riri:
            titi.append(row)
    
    print(titi)
    
    with open(nomnewfic,'w',newline='') as fifi:
        writer = csv.writer(fifi) 
        writer.writerow

Attention aux identifiants. On peut garder l'id d'un élément comme id d'un noeud mais si on insère les types d'éléments et de relations comme des noeuds (ce que l'on ne fait pas pour le moment), un préfixe ou des espaces de noms sont nécessaires.

### Noeuds et relations 
Configurer la time zone par défaut de la base.
#### Noeuds

Le fichier `eltsdocs_header.csv` contient une seule ligne.

    ideltdoc:ID,nom,idtypeelt:LABEL,id_auteur_elt,date:datetime(Europe/Paris)

Dans le fichier `eltsdocs.csv` , la ligne d'en-tête du fichier original a été supprimée.

#### Relations

Le fichier `relations_header.csv` contient une seule ligne. 

    idrel,ideltdocparent:START_ID,ideltdocenfant:END_ID,idtyperel:TYPE,idauteur,date:datetime(Europe/Paris)

Le champ idrel d'une relation est conservé pour d'éventuelles vérifications avec la base mariadb.

Dans le fichier `relations.csv` , la ligne d'en-tête du fichier original a été supprimée. 

### Syntaxe de l'appel
Attention l'aide n'est pas très précise.

Il faut se placer dans le répertoire `/var/lib/neoj` et copier les fichiers à importer dans le sous-répertoire `import`. Attention aux droits, il faut agir en tant qu'utilisateur `neo4j` (ni `remy`, ni `root`).

    sudo -u neo4j neo4j-admin import --nodes import/eltsdocs_header.csv,import/eltsdocs_new.csv --relationships import/relations_header.csv,import/relations.csv

Echec de l'importation à cause d'un problème avec la syntaxe des dates. La base neo4j devient inutilisable. Il faut

- arréter le serveur: `sudo systemctl stop neo4j`
- supprimer à la main les répertoires `/var/lib/neo4j/data/databases/neo4j` et `/var/lib/neo4j/data/transactions/neo4j`
- redémarrer le serveur `sudo systemctl start neo4j`

Pour contourner le problème on importe avec un champ `chaine_date` qui est une chaine de caractères. Les fichiers d'en-tête deviennent

    ideltdoc:ID,nom,idtypeelt:LABEL,id_auteur_elt,chaine_date
    idrel,ideltdocparent:START_ID,ideltdocenfant:END_ID,idtyperel:TYPE,idauteur,chaine_date
    
Encore un échec de l'importation car la base contient des relations incohérentes avec des éléments documentaires qui n'existent pas. Exemple de requête permettant de les repérer:

    SELECT * FROM `relations` 
    LEFT JOIN eltsdocs ON ideltdocparent = eltsdocs.ideltdoc
    WHERE eltsdocs.ideltdoc IS NULL

40 relations de ce type à supprimer et 249 lorsque c'est l'élément enfant qui n'existe pas. Les requêtes pour supprimer le lignes dans la table `relations`:

    DELETE relations FROM `relations` 
        LEFT JOIN eltsdocs ON ideltdocparent = eltsdocs.ideltdoc
        WHERE eltsdocs.ideltdoc IS NULL

    DELETE relations FROM `relations` 
        LEFT JOIN eltsdocs ON ideltdocenfant = eltsdocs.ideltdoc
        WHERE eltsdocs.ideltdoc IS NULL

-------

Importation réussie: 7678 noeuds, 9588 relations, 59476 propriétés
