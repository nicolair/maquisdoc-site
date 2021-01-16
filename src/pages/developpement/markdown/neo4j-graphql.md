---
theme: "journal"
title: "neo4j-graphql-gatsby"
date: "2020-12-18"
---
Il s'agit de mettre en place **localement** une API javascript entre la base neo4j et le site statique gatsby. Cela passe par l'insertion d'un serveur GraphQL intermédiaire.

### 1. Notes de lecture

La référence est [GRANDSTACK](https://neo4j.com/labs/grandstack-graphql/).

> GraphQL is a specification for client-server communication that describes the features, functionality, and capability of the GraphQL API query language.

> Introspection is a powerful feature of GraphQL that allows us to ask a GraphQL API for the types and queries it supports. Introspection becomes a way of self-documenting the API. Tools that make use of introspection can provide human readable API documentation, visualization tooling, and leverage code generation to create API clients.

> It’s important to understand that GraphQL is an API query language and not a data-base query language. GraphQL lacks semantics for many complex operations required of database query languages, such as aggregations, projects, and variable
length path traversals.

> Apollo Server allows us to easily spin up a Node.js server serving a GraphQL endpoint by defining our type definitions and resolver functions. Apollo Server can be used with many different web frameworks; however, the default and most popular is Express.js. Apollo Server can be installed with `npm: npm install apollo-server`.


### 2. De neo4j à GraphQL

La référence est la vidéo : [Getting started with Neo4j, Gatsby and GraphQL](https://youtu.be/siPmZRTRki8).

Il s'agit d'installer un serveur Node.js (apollo) avec divers modules. Ce serveur présente les données de la base neo4j à travers une API utilisable par un driver Gatsby.  
Dans le répertoire neo4j-graphql à côté du répertoire maquisdoc-gatsby, on crée un projet node par la commande: `npm init -y`.      
On installe ensuite des modules:

    npm install neo4j-graphql-js
    npm install neo4j-driver
    npm apollo-server
    
Le fichier `index.js` implémente un serveur qui permet d'effectuer des requêtes sur GraphQL:

    const { makeAugmentedSchema } = require("neo4j-graphql-js")
    const {ApolloServer} = require("apollo-server")
    const neo4j = require("neo4j-driver")
    
    const typeDefs = /* GraphQL définition du schéma*/ `
      détaillé plus loin
    `
    const schema = makeAugmentedSchema({typeDefs})
    
    const driver = neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic("neo4j","")
    );

    const server = new ApolloServer({schema, context: {driver}})
    
    server.listen(3003,"0.0.0.0").then(({ url }) => {
        console.log(`GraphQL ready at ${url}`);
    });

Pour lancer le serveur qui écoute localement le port 3003, il suffit de lancer la commande `node index.js` dans le répertoire du projet. Si elle répond

    GraphQL ready at 0.0.0.0:30303
    
on peut interroger le serveur.

Conclusion, 3 points importants dans index.js

- connexion du serveur apollo au serveur neo4j: `const driver = ...`.
- connexion au serveur apollo: `const server = ...` et `server.listen(...)`.
- schéma de la base GraphQL:  
`const schema = makeAugmentedSchema({typeDefs})`.

Le détail du schéma est

    const typeDefs = /* GraphQL */ `
    type Document {
        titre: String
        typeDoc: String
        url: String
        urlEnon: String
        urlCorr: String
        urlSrcEnon: String
        urlSrcCorr: String
        concepts: [Concept] @relation(name: "DOCUMENTE", direction: "OUT")
        evenements: [Evenement] @relation(name: "UTILISE", direction: "IN")
    }
    
    type Concept {
        litteral: String
        discipline : String
        description: String
        documents: [Document] @relation(name: "DOCUMENTE", direction: "IN")
        evenements: [Evenement] @relation(name: "EVALUE", direction: "IN")
        listexos: [Document] @cypher(statement: """
        MATCH (f {typeDoc: "liste exercices"})-[:EVALUE]->(this)
        RETURN f
        """)
    }
    
    type Evenement {
        nom: String 
        typeEvt: String
        concepts: [Concept] @relation(name: "EVALUE", direction: "OUT")
        documents: [Document] @relation(name: "UTILISE", direction: "OUT")
        sousevenements: [Evenement] @relation(name: "CONTIENT", direction: "OUT")
    }
    
    type Query {
    alldocuments : [Document] @cypher(statement: """
        MATCH (d:Document {typeDoc:"cours"})
        RETURN d
    """),
    semaines : [Evenement] @cypher(statement: """
        MATCH (s:Evenement {typeEvt:"semaine de colle"})
        RETURN s
    """),
    semaineParNom(nomS: String!) : Evenement @cypher(statement: """
        MATCH (s:Evenement 
            {
            typeEvt:"semaine de colle", 
            nom : $nomS
            }
        )
        RETURN s
    """),
    }
    `

### 3. Implémentation de la vue "une année en mpsi B"

#### 1. Requête GraphQL adaptée.

On a introduit dans le schéma des définitions de requêtes. En particulier la requête nommée `semaines`

      semaines : [Evenement] @cypher(statement: """
        MATCH (s:Evenement {typeEvt:"semaine de colle"})
        RETURN s
      """),

qui renvoie une liste d'événements. Une semaine *est* un événement.
    
Pour vérifier, dans la page affichée par le serveur Apollo, on peut entrer le requête GraphQL:

    semaines {
        nom
        concepts {
            litteral
            documents{
                url
            }
            listexos{
                url
            }
          }
        documents {
            url
        }
        sousevenements {
            nom
        }
    }


Elle renvoie, pour chaque semaine, la liste des concepts à évaluer (avec les feuilles d'exos qui les évalue, les documents de cours qui les documentent), le programme de colle et les questions de cours (sous-événements).  
Une semaine de colle est un événement pédagogique, les questions de cours sont des événements pédagogiques *contenus* dans la semaine.


Une requête de ce type sera le fondement de la vue.

#### 2. De GraphQL à Gatsby

On installe le plugin `gatsby-source-graphql` avec `npm install` dans le dossier du projet gatsby. On modifie le fichier de configuration `gatsby-config.js` en ajoutant

    {
        resolve: `gatsby-source-graphql`,
        options: {
            typeName: "MAQUIS",
            fieldName: "maquis",
            url : "http://localhost:3003"
        }
    }

à la liste des plugins.

On lance les serveurs neo4j et apollo avant de construire le site avec le gatsby develop.

On retrouve bien le maquis dans GraphiQL. La requête pour la vue "*une année en mpsi B*" est 

    query MyQuery {
        maquis {
            semaines {
                nom
                concepts {
                    litteral
                    documents {
                        url
                    }
                    listexos {
                        url
                    }
                }
                sousevenements {
                    nom
                }
            }
        }
    }
    
    
Le serveur apollo doit fonctionner même après la construction du site gatsby.
    
#### 3. La vue "une année en mpsi B"

La référence est la video [Using GraphQL With Gatsby.js| Building A Travel Guide With Gatsby, Neo4j &GraphQL: Part 2](https://www.youtube.com/watch?v=XCuknJAIX84)

On modifie deux fichiers

* `gatsby-node.js` pour créer des pages associées aux événements "*semaine de colle*".
* `semaine-page.js` qui est un modèle (*template*) écrit en jsx (javascrip pour React) pour ces pages.

Fichier `gatsby-node.js`:

    const path = require(`path`)
    const { createFilePath } = require(`gatsby-source-filesystem`)
    
    exports.onCreateNode = ({ node, getNode, actions }) => {
    //console.log(`Node created of type "${node.internal.type}"`)
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `pages` })
        createNodeField({
        node,
        name: `slug`,
        value: slug,
        })
    }
    }
    
    exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const result = await graphql(`
        query {
        allMarkdownRemark {
            edges {
            node {
                fields {
                slug
                }
                frontmatter {
                theme
                }
            }
            }
        }
        maquis {
            semaines {
            nom
            concepts {
                litteral
                documents{
                    url
                }
                listexos{
                    url
                }
            }
            documents {
                url
            }
            sousevenements {
                nom
            }
            }
        }
        }
    `)
    
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        nom_tpl = `dvlp-page.js`
        if ( node.frontmatter.theme === "journal" ) {
        nom_tpl = `jrnl-page.js`
        }
        chem = `./src/templates/` + nom_tpl
        createPage({
        path: node.fields.slug,
        component: path.resolve( chem ),
        context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
        },
        })
    })
    
    const semaines = result.data.maquis.semaines
    
    semaines.forEach((semaine,index) => {
        ({ nom, concepts, documents, sousevenements } = semaine)
        const next = index === semaines.length - 1 ? semaines[0] :semaines[index + 1]
        const previous = index === 0 ? semaines[semaines.length - 1] : semaines[index - 1]
        slug = nom.replace('semaine ','semaine_')  
        createPage({
        path: slug,
        component: path.resolve(`./src/templates/semaine-page.js`),
        context: {
            nom: nom,
            semaine: semaine,
            previous,
            next
            },
        })
    })
    }

Fichier `templates\semaine-page.js`

    import React from "react"
    import { Link } from "gatsby"
    import Layout from "../components/layout"
    
    const SemainePage = ({ data, pageContext }) => {
    const { previous, next} = pageContext 
    const semaine = pageContext.semaine
    const concepts = semaine.concepts
    const q_cours = semaine.sousevenements
    
    function lien_cours(documents){
        if (documents.length >0){
            const lien = 
            ( <a href =  { documents[0].url }
            target="_blank" rel="noopener noreferrer"> (document de cours) </a> )
            return lien
        }
    }
    
    function lien_exos(listexos){
        if (listexos.length >0){
            const lien = 
            ( <a href =  { listexos[0].url }
            target="_blank" rel="noopener noreferrer"> (feuille d'exercices) </a> )
            return lien
        }
    }
    
    return (
        <Layout>
        <h3> Une année en mpsi B </h3>
        <h4>{pageContext.nom}</h4>
        <p>
        <a href= {semaine.documents[0].url} target="_blank" rel="noopener noreferrer">
            Programme de la semaine
        </a>
        </p>
        <p>Elle porte sur: 
        <ul>
        { concepts.map(({litteral, documents, listexos}) => 
        <li> 
            {litteral}
            {lien_cours(documents)}
            {lien_exos(listexos)}
        </li>)}
        </ul>
        </p>
        <p>
        Questions de cours
        <ul>
        {q_cours.map(({nom})=>
            <li> {nom} </li>
        )}
        </ul>
        </p>
        <nav>
        <ul
            style={{
                display: `flex`,
                flexWrap: `wrap`,
                justifyContent: `space-between`,
                listStyle: `none`,
                padding: 0,
            }}
            >
            <li>
            <Link to={ previous.nom.replace('semaine ','/semaine_') }>
                {previous.nom}
            </Link>
            </li>
            <li>
            <Link to={ next.nom.replace('semaine ','/semaine_') }>
                { next.nom }
            </Link>
            </li>
        </ul>
        </nav>
        </Layout>
    )
    }
    
    export default SemainePage


