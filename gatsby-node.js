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
        problemedocuments(orderBy: titre_asc) {
          titre
          description
          url
          evenements {
            nom
          }
        }
        coursdocuments(orderBy: titre_asc) {
          titre
          description
          url
          urlSrc
          concepts {
            litteral
            description
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
    ({titre,description,url,evenements} = probleme)
    slug = 'probleme_' + titre
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
    ({titre,description,url,urlSrc,concepts} = cours)
    var urlObj = require('url')
    var q = urlObj.parse(url, true)
    const slug = q.pathname.replace('.pdf','')
    createPage({
        path: slug,
        component: path.resolve(`./src/templates/cours-page.js`),
        context: {
            cours
        }      
    })
  })
}
