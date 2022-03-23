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
        Document(orderBy: titre_asc) {
          _id
          description
          titre
          typeDoc
          url
        }
        problemedocuments(orderBy: titre_asc) {
          _id
          titre
          description
          url
          evenements {
            nom
          }
        }
        coursdocuments(orderBy: titre_asc) {
          _id
          titre
          description
          url
          urlSrc
          concepts {
            _id
            litteral
            description
          }
        }
        exercicedocuments(orderBy: titre_asc) {
          _id
          titre
          description
          url
          urlSrc
          conceptsEVAL{
           _id
           litteral
          }
        }
        Concept(orderBy: litteral_asc) {
          litteral
          discipline
          description
          _id
          conceptsvoisins {
            typeRel
            out
            conceptLitteral
            conceptId
          }
          documentsvoisins(orderBy: docTitre_asc) {
            typeRel
            out
            docType
            docTitre
            docUrl
            docId
          }
        }
        feuilleexercicesdocuments(orderBy: titre_asc) {
          titre
          _id
          url
          conceptsEVAL{
            _id
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
  
  const problemes = result.data.maquis.problemedocuments
  problemes.forEach((probleme,index) => {
    ({titre,description,url,evenements,_id} = probleme)
    slug = 'document_' + _id
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/probleme-page.js`),
        context: {
            probleme
        }
    })
  })
  
  const lcours = result.data.maquis.coursdocuments
  lcours.forEach((cours,index) => {
    ({titre,description,url,urlSrc,concepts,_id} = cours)
    const slug = "document_"+_id
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/cours-page.js`),
        context: {
            cours
        }      
    })
  })

  const lexercices =      result.data.maquis.exercicedocuments
  lexercices.forEach((exo,index) => {
    ({titre,description,url,urlSrc,conceptsEVAL,_id} = exo)
    const slug = "document_"+_id
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/exercice-page.js`),
        context: {
            exo
        }      
    })
  })
  
  
  const ldefautdocuments = result.data.maquis.Document
  ldefautdocuments.forEach((doc,index) => {
    ({titre, description,url,typeDoc,_id} = doc)
    const defautTypes = [ "livre problèmes", "livre", "programme", "liste rapidexo",
      "sujet dossier ADS","article scientifique"]
    if (defautTypes.includes(typeDoc)){
          const slug =  "document_"+_id
          createPage({
            path: slug,
            component: path.resolve(`./src/templates/defdoc-page.js`),
            context: {
              doc
            }
          })
    }
  })
  
  const lconcepts = result.data.maquis.Concept
  lconcepts.forEach((concept,index) => {
    ({litteral,discipline,description,_id,conceptsvoisins,documentsvoisins} = concept)
    const slug = "concept_" + _id
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/concept-page.js`),
        context: {
            concept
        }      
    })
  })
  
  const lfeuilleexos = result.data.maquis.feuilleexercicesdocuments
  lfeuilleexos.forEach((feuilleexo,index) => {
    ({titre,_id,conceptsEVAL} = feuilleexo)
    const slug = "document_" + _id
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/feuilleexo-page.js`),
        context: {
            feuilleexo
        }      
    })
  })
  
}
