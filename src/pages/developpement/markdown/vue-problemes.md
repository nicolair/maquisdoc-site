---
theme: "journal"
title: "vue 'Problèmes'"
date: "2021-01-20"
---
L'accès aux problèmes se fait par diverses vues:

* "Problèmes" dans le menu des vues est le point d'accès principal. Elle présente 

    * un lien vers une vue de recherche textuelle 
    * la liste (classée alphabétiquement) selon le titre
    * pour chaque problème de la liste, des liens vers le document pdf et vers les relations du problème dans le maquis
    
* "Recherche par mot" permet la recherche d'une chaîne de caractères dans les noms et descriptions des problèmes. Elle renvoie une liste de problèmes analogue à celle de la vue "Problèmes"

* Chaque problème dispose de sa propre page présentant les relations de ce problème avec d'autres éléments du maquis. Cette vue sera sûrement complétée ultérieurement. On y accède par les deux vues précédentes.
 
### 1. Vue principale (liste)
Fichier `/src/pages/vues/problemes.js`.  
Ce fichier (en javascript pour react) est analogue à celui pour les feuilles d'exercices (`feuilles.js`).  
La donnée sous-jacente est la liste des problèmes classés alphabétiquement sur le titre. La requête cypher correspondante est

    MATCH (p:Document {typeDoc:'problème'})
    RETURN p.titre, p.description, p.url
    ORDER BY p.titre
    
On la met en oeuvre en ajoutant la requête

    problemedocuments : [Document] @cypher(statement: """
      MATCH (d:Document {typeDoc:"problème"})
      RETURN d
    """),

au schéma du serveur apollo. Le script peut alors aller chercher les données sur le serveur graphql avec la requête

    export const query = graphql`
      query {
        maquis {
          problemedocuments(orderBy: titre_asc) {
            titre
            description
            url
          }
        }
      }
    `

### 2. Vue recherche par mot. Index. Site dynamique.

Ce script a été plus difficile à coder que les précédents. En effet, pour chercher une chaine de caractères sur le titre et la description. Il faut:

* un [index textuel](https://neo4j.com/docs/cypher-manual/3.5/schema/index/#schema-index-fulltext-search) dans la base neo4j, 
* lancer une requête *à l'instigation de l'utilisateur* donc **après** la construction du site par gatsby.

#### 2.1. Index et schéma.

On crée dans neo4j un index des titres et des descriptions pour tous les documents par la commande cypher

    CALL db.index.fulltext.createNodeIndex("TitresEtDescriptions",["Document"],["titre","description"])

On cherche alors le mot "Gauss" avec:

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions","Gauss")
      YIELD node, score
    RETURN node.titre, node.description, node.url, score
    
[Référence](https://neo4j.com/docs/cypher-manual/current/clauses/call/) pour l'appel de procédures. On peut utiliser un paramètre dans la requête

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions",$mot)
      YIELD node, score
    RETURN node.titre, node.description, node.url, score

Ce qui conduit au même résultat que la première forme lorsque le paramètre a été défini dans le browser par `:param mot=> "Gauss"`.  
L'index porte sur tous les documents, pour filtrer seulement les problèmes, on utilise une sous-requête.

    CALL db.index.fulltext.queryNodes("TitresEtDescriptions", $mot)
      YIELD node, score
    WITH node, score
      WHERE node.typeDoc = "problème"
    RETURN node.typeDoc, node.titre, node.description, node.url, score
    
On modifie alors le schéma du serveur apollo pour présenter cette requête.
Le script `maquisdoc-apollo.js` n'est pas complètement reproduit dans ce document, seulement les modifications significatives.
Nouvelle requête paramétrée.

    searchpbs (mot:String): [Document] @cypher(statement: """
      CALL db.index.fulltext.queryNodes("TitresEtDescriptions", $mot)
        YIELD node, score
      WHERE node.typeDoc = "problème"
      RETURN  node
    """),
    
Remarque, le *"score"* de la recherche est perdu. Il faudrait modifier le type d'objet que renvoie la requête pour le récupérer.  
Tant qu'on y est, on introduit une nouvelle requête (analogue à `problemedocuments`) pour que le serveur graphql présente tous les documents de cours.

    coursdocuments : [Document] @cypher(statement: """
      MATCH (d:Document {typeDoc:"cours"})
      RETURN d
    """),
    
#### 2.2. Page dynamique dans gatsby.

Gatsby est un constructeur de site statique qui fonctionne sans serveur. Toutes les requêtes qui peuplent les pages sont passées à la construction du site.  
Avec un formulaire de recherche, le site devient dynamique, c'est à dire qu'il change après la construction à la demande de l'utilisateur.  
Pour cela il faut utiliser la bibliothèque Apollo Client en ajoutant le plugin `gatsby-plugin-apollo` dans le fichier `gatsby-config.js`.
Cette bibliothèque permet de passer une requête sur le serveur graphql (apollo) après la construction du site par l'intermédiaire de `useLazyQuery`.  
Le fichier `/src/pages/vues/recherche1.js` est reproduit ci dessous

    import React from "react"
    import { css } from "@emotion/core"
    import { Link } from "gatsby"
    //import { rhythm } from "../utils/typography"
    import Layout from "../../components/layout"
    import LayoutVues from "../../components/layoutvues"
    
    import {useLazyQuery, gql } from "@apollo/client"
    
    const GET_PBS_QUERY = gql`
    query getPbs($mot : String){
        searchpbs(mot: $mot){
        titre,
        description,
        url
        }  
    }
    `
    
    export default function RecherchePage({ data }) {
      const [getPbs, { loading, data: pbsData}] = useLazyQuery(GET_PBS_QUERY)
      
      const onChercherCliqué = e => {
        const mot_a_chercher = document.getElementById("mot_a_chercher").value
        getPbs({ variables:{mot:mot_a_chercher}})
        //console.log(mot_a_chercher)
        //console.log(pbsData)
      }
    
      return (
        <Layout>
        <LayoutVues>
            <h2> Recherche dans les problèmes</h2> {loading}
            <input type="text" id="mot_a_chercher"/>
            <button onClick={onChercherCliqué}>
                Chercher
            </button>
            <table>
            <thead>
                <tr>
                  <th> description</th>
                  <th> nom/lien pdf</th>
                  <th> détail </th>
                </tr>
            </thead>
            <tbody>
                { (pbsData) && pbsData.searchpbs.map(({titre, description,url},index)=>(
                  <tr key={index}>
                    <td> {description} </td>
                    <td> 
                      <a 
                        css={css`color:darkgreen;`}
                        href= {url}
                        target="blank"
                        rel="noopener noreferrer">
                        <small>{titre}</small>
                      </a>
                    </td>
                    <td>
                      <Link 
                        css={css`color: darkgreen;`}
                        to={"/probleme_" + titre}>
                        <small>relations</small>
                      </Link>
                    </td>
                  </tr>
                )) }
            </tbody>
            </table>
        </LayoutVues>
        </Layout>
      )
    }


### 3. Pages de relations
On modifie `gatsby-node.js` pour créer des pages associées aux noeuds du type *problème* (url `/probleme_titre`). Ici `titre` est le titre du problème c'est à dire le coeur des noms des fichiers du problème qui est un identifiant unique pour chaque problème.  
Lors de la construction, ces pages sont crées à partir du modèle `/src/templates/probleme-page.js`. 

### 4. Organisation du passage "*en production*"
1. base neo4j: elle a été modifiée localement (ajout index)
    1. dump local
    2. transfert du fichier sur le droplet
    3. load de la base sur ledroplet
2. serveur apollo
    1. commit local + push sur github
    2. pull sur droplet
3. app maquisdoc sur digital ocean
    1. commit local + push sur git hub
    2. cela déclenche un "build" de l'appli, attention à l'url du serveur apollo dans le `gatsby-config.js`.
    
Commandes de dump de la base locale

    sudo systemctl stop neo4j
    cd /var/lib/neo4j
    sudo -u neo4j neo4j-admin dump --database=neo4j --to=backups/maquisdoc/vx-xx.dump
    
Commandes pour transférer la base:  
localement : 

    scp /var/lib/neo4j/backups/maquisdoc/vx-xx.dump remy@188.226.151.10:/home/remy/dumps
    
sur le droplet dans le dossier de "remy":

    sudo systemctl stop neo4j
    sudo cp dumps/vx-xx.dump /var/lib/neo4j/backups/maquisdoc/vx-xx.dump 
    cd /var/lib/neo4j
    sudo chown neo4j:neo4j backups/maquisdoc/vx-xx.dump
    sudo -u neo4j neo4j-admin load --from=backups/maquisdoc/vx-xx.dump --database=neo4j --force
    sudo systemctl start neo4j
    
Commande pour "*tirer*" le serveur apollo sur le droplet

    cd maquisdoc-graphql
    git fetch origin main
    pm2 stop ecosystem.config.js
    pm2 start ecosystem.config.js

### 5. Architecture

La page de recherche fonctionne bien sur le serveur local de développement mais pas sur l'application Digital Ocean de production. Le problème vient de l'architecture de l'application décrite dans l'article *"maquisdoc: cloud"* du journal de développement.  
L'article *"nouvelle architecture"* présente la solution a cette difficulté.
