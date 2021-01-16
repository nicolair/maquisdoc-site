---
theme: "journal"
title: "neo4j: exploration"
date: "2020-11-26"
---

### 1. Exploration de neo4j: à faire

-   dump d'une base pour backup                                             OK
-   fonctions  dans cypher :                                                OK
    - transformation de date temp de chaine à date-time                     OK
    - remplacement des labels idtypeelt par une chaine de caractère
    - transformation des liens web                                          OK
- démaquiser: supprimer les noeuds et les branches insignifiantes           OK
- se renseigner sur la bibiothèque APOC                                     OK
- se renseigner sur grand stack et l'interface avec graphql react et gatsby OK
    
Remarques
- Les noms des labels des noeuds doivent (recommandé) être en camel-case commençant par une majuscule : `VehicleOwner`
- les types de relations doivent (recommandé) être en majuscule séparés par des underscores : `OWNS_VEHICLE`

### 2. Exemple d'utilisation de fonctions

`match (n:`8`)  return split(n.nom, ";")[0];`

Renvoie la partie url d'un élément documentaire du type `lienweb` (8). On peut remarquer que certains liens sont brisés.

Un exemple plus élaboré:

`match (n:`20`)-[:`4`]->(w) return n,w;`

renvoie les noeuds feuilles d'exercices et leur lien web. Je modifie pour renvoyer seulement le nom de la feuille et l'url du pdf dans l'espace digital ocean 

    match (n:`20`)-[:`4`]->(w) 
    return n.nom ,
           replace(split(w.nom,';')[0],
                   'http://back.maquisdoc.net/data/exos_nicolair/_fex',
                   'https://maquisdoc-math.fra1.digitaloceanspaces.com/math-exos/A')`;
                   
Les indentations sont là seulement pour la lisibilité. Je voudrais utiliser des variables pour que ce soit plus clair.

----

Un autre exemple autour du problème des dates insérées dans maquisdoc qui ne sont pas vraiment consistantes (le type d'élément `18` correspond aux exercices)

    MATCH (n:`18`)  
        WHERE NOT n.chaine_date = "0000-00-00 00:00:00" 
        RETURN datetime(REPLACE(n.chaine_date," ","T"))
        
Pour se convaincre qu'on a bien une date on classe, les plus récents d'abord.

    MATCH (n:`18`)  
        WHERE NOT n.chaine_date = "0000-00-00 00:00:00" 
        RETURN n 
        ORDER BY datetime(REPLACE(n.chaine_date," ","T")) DESC

### 3. Administration :  `dump` et `load` de bases
[référence](https://neo4j.com/docs/operations-manual/current/tools/dump-load/#neo4j-admin-dump-load)
 Pour le moment, la base active dans le serveur neo4j s'appelle toujours `neo4j`. Je ne sais pas si , avec la version "communautaire" j'ai le droit de l'appeler autrement. Pour avoir plusieurs bases, il faut avoir la version "entreprises".</br>
 Je n'ai pas étudié les "online backup" proposés dans le chapitre "Backup" de #Operation Manual".

Dans le répertoire `/var/lib/neo4j` création (en tant qu'utilisateur `neo4j`) de sous répertoires `backups/neo4j` et `backups/maquisdoc`. </br>
Après avoir stoppé le service `neo4j`, la commande 

    sudo -u neo4j neo4j-admin dump --database=neo4j --to=backups/maquisdoc/2020-11-27.dump
    
réalise une sauvegarde de la base courante.

---

Pour récupérer une base sauvegardée (load), comme elle doit s'appeler `neo4j` dans le serveur, la documentation indique qu'il faut la supprimer (? DROP) avant mais ce n'est valable que pour la version "entreprises".

Essai de la commande (après avoir arrêté le service)

    sudo -u neo4j neo4j-admin load --from=backups/maquisdoc/2020-11-27.dump --database=neo4j --force
    
Pour vérifier, on va supprimer quelques noeuds insignifiants (démaquiser) puis sauvegarder la version élaguée avant de la recharger.


On va supprimer l'élément 

    <id>: 3609 
    chaine_date: 2010-02-05 16:53:49
    id_auteur_elt: 2
    ideltdoc: 6870
    nom: pcsi

Commandes cypher :

    MATCH (n { nom : 'pcsi'}) RETURN n;  #pour vérifier
    MATCH (n { nom : 'pcsi'}) DETACH DELETE n;  #pour supprimer

puis la base est sauvegardée sous le nom v0-1.dump. Selon que l'on recharge l'une ou l'autre des bases sauvegardées, on voit bien que l'élément `pcsi` manque ou non.

### 4. Démaquisage
Transformer les `chaine_date` de valeur '000-00-00 00:00:00' en '2000-01-01 00:00:00'

    MATCH (n {chaine_date:'0000-00-00 00:00:00'}) SET n.chaine_date='2000-01-01 00:00:00' RETURN n.chaine_date
    
Remplacer l'espace au milieu par un 'T'

    MATCH (n) SET n.chaine_date=REPLACE(n.chaine_date," ","T") RETURN n.chaine_date
    
Former une nouvelle propriété au format datetime:

    MATCH (n) SET n.date=datetime(n.chaine_date) RETURN n.chaine_date, n.date
    
Supprimer la propriété chaine_date de tous les éléments

    MATCH (n) REMOVE n.chaine_date RETURN n
    
----
Mise à jour du lien pour les noeuds `lienweb`.

Remplacer la propriété `nom` par les propriétés `url` et `type_doc`

    MATCH (n:`8`)
    SET n.url = split(n.nom,';')[0]
    SET n.type_doc = split(n.nom,';')[1]
    RETURN n.url , n.type_doc
    
Suppression de la propriété `nom` pour les noeuds de ce type.

    MATCH (n:`8`)
    REMOVE n.nom
    RETURN n
    
Requête pour obtenir les types de documents des liens web avec le nombre de documents pour chaque type.

    MATCH (n:`8`)
    RETURN DISTINCT n.type_doc, count(*) AS cpte
    ORDER BY cpte DESC
    
On trouve 111 types dont certains orthographiés différemment. On en réécrit certains. Il ne me semble pas pertinent d'indiquer le type sémantique du document. On doit pouvoir trouver cette information dans le noeud parent.</br>
Il ne faut pas aller beaucoup au dela du format (à méditer)

- texte pdf
- image pdf
- source teX
- ...

Compléter cette liste, doit-on garder le nom `type_doc` pour cette propriété ?

----

Une requête pour vérifier que les lien web ont bien un seul parent:

    MATCH (w:`8`)<--(n) 
    RETURN w.url, count(*) AS cpte
    ORDER BY cpte DESC

Variante pour n'avoir que les liens web avec plusieurs parents:

    MATCH (w:`8`)<--(n) 
    WITH  w, count(*) AS cpte WHERE cpte > 1
    RETURN w, count(*) 

Il existe des liens avec plusieurs parents.
Par exemple certains lien web pour des feuilles d'exercices ont plusieurs parents. La requête suivant supprime une relation inconsistante. 
    
Comme les relations dans maquisdoc ont un identifiant, on peut les repérer pour les supprimer directement:

    MATCH ()-[r {idrel:"15927"}]->() DELETE r

Tout a été rectifié. Un lien web au plus un parent maintenant.</br>
Il existe aussi des liens web orphelins. La requête 

    MATCH (w:`8`)
    WHERE NOT (w)<--()
    RETURN w

renvoie 90 noeuds. On peut supprimer un  `lienweb` orphelin s'il existe un autre `lienweb` non orpelin avec le même `url`. 

Une requête pour chercher si l'url d'un lien web ophelin est présent dans un autre lien qui n'est pas orphelin

    MATCH (w:`8`)
      WHERE NOT (w)<--()
    WITH w.ideltdoc AS nini, w.url AS nunu, w
    MATCH (t:`8`{url:nunu})<--()
    RETURN t,w
    
Ceci permet de repérer 5 liens web orphelins que l'on peut supprimer car il existe un autre lien non orphelin vers le même document. Il suffit de remplacer le `RETURN t,w` par `DELETE w`. Le `DETACH` est inutile car le noeud à supprimer n'est lié à rien. 

Il reste 85 liens orphelins.

---

Travail avec les liens orphelins. Sont-ils pertinents?

Suppression des liens vers des fichiers locaux. On commence par les repérer avec 

    MATCH (w:`8`)
      WHERE  w.url STARTS WITH '/data/' AND NOT (w)<--()
    RETURN w
    
puis on les supprime en remplaçant `RETURN` par `DELETE`. On supprime les liens vers ds documents qui n'existent plus. Il en reste 8. Certains méritent d'être récupérés. Par exemple les feuilles rapidexo sur les courbes parmétrées. On recrée une relation entre `Courbes paramétrées` (ideltdoc 6430) et `Exercices (petits) Maths` (ideltdoc 1668) puis les liens web vers les documents.<br/>
Il reste 4 éléments: 

╒══════════════════════════════════════════════════════════════════════╕
│"w"                                                                   │
╞══════════════════════════════════════════════════════════════════════╡
│{"date":"2000-01-01T00:00:00Z","ideltdoc":"4474","type_doc":"source te│
│X","url":"http://back.maquisdoc.net/data/cours_nicolair/C2005.tex","id│
│_auteur_elt":"1"}                                                     │
├──────────────────────────────────────────────────────────────────────┤
│{"date":"2000-01-01T00:00:00Z","ideltdoc":"4475","type_doc":"texte pdf│
│","url":"http://back.maquisdoc.net/data/cours_nicolair/C2005.pdf","id_│
│auteur_elt":"1"}                                                      │
├──────────────────────────────────────────────────────────────────────┤
│{"date":"2020-02-28T17:32:11Z","ideltdoc":"8441","type_doc":"feuille p│
│df","url":"http://back.maquisdoc.net/data/exos_nicolair/_fex_ap.pdf","│
│id_auteur_elt":"2"}                                                   │
├──────────────────────────────────────────────────────────────────────┤
│{"date":"2013-08-31T06:36:07Z","ideltdoc":"9423","type_doc":"source te│
│X","url":"http://back.maquisdoc.net/data/cours_nicolair/S1-LCD-deriv.t│
│ex","id_auteur_elt":"1"}                                              │
└──────────────────────────────────────────────────────────────────────┘

Les 4 éléments ont été traités: les liens web vers le cours et la feuille d'exo "approximations" ont été rattachés, le lien vers l'extrait du programme a été supprimé.

### Bibiothèque APOC
[Références](https://neo4j.com/labs/apoc/4.1/installation/). 
Il s'agit de fonctions codées en java qui étendent les fonctions de cypher et qui peuvent être appelées par une requête cypher. Pour installer cette bibiothèque dans le serveur local, il faut copier le fichier .jar de 
`var/lib/neo4j/labs` vers `var/lib/neo4j/plugins`.

Il faut aussi peut être changer quelque chose dans la configuration du serveur. Voir le `README.txt` du répertoire `plugins`. 

**Remarque. Il semble exister une bibliothèque du même type pour une liaison avec GraphQL.**

### Conclusion

Le 03/12/20: après cette exploration, je sauvegarde la base en `v0-2.dump` et mets à jour le site.

D'après la documentation sur grand stack, l'interface entre neo4j et Gatsby nécessite un schéma clair de la base de données. 

Nouvelle séquence de travail avec la base: définition d'un schéma ce qui inclut les remplacements des labels numériques actuels. Voir la page `neo4j: schéma du journal`.
