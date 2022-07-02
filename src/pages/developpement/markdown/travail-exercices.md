---
theme: "journal"
title: "Travail avec des exercices"
date: "2022-07-01"
---
Durant les dernières semaines, j'ai travaillé sur des exercices autour du théorème de Ménélaüs: modification d'énoncés existants, nouveaux corrigés, nouveaux exercices. 
Dans l'optique de compléter la maintenance, cet article récapitule ce qui est à faire pour insérer les modifications dans la base après la rédaction en LateX. 

1. Création dans la base neo4j d'un noeud correspondant au nouvel exercice "dt26" type `DOCUMENT` 

        {typeDoc:"exercice",
        titre:"dt26",
        urlSrcEnon:"https://github.com/nicolair/math-exos/blob/master/Edt26.tex",
        url:"https://maquisdoc-math.fra1.digitaloceanspaces.com/math-exos/Aexo_dt26.html"}
        
et des relations "dt26" `EVALUE` le concept "déterminant",
la liste d'exos "déterminant" `CONTIENT` "dt26".

2. Maintenance du dépôt d'exercices.  
Après reconstruction du site, l'exercice apparait complètement dans les vues en liaison avec le concept et la liste.

3. Dates.  
La propriété `date` du noeud `(e)` est fixée à *maintenant* par un

                SET e.date=datetime()
                
On peut former la liste des 25 noeuds les plus récents par

        	MATCH (e) WHERE e.date IS NOT NULL 
        	RETURN e.date, e ORDER by e.date DESC LIMIT 25
