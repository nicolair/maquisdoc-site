import React from "react"
import { css } from "@emotion/core"
import { Link, graphql } from "gatsby"
import { rhythm } from "../../utils/typography"
import Layout from "../../components/layout"
import LayoutDvlpt from "../../components/layoutdvlpt"

export default function Devlopmt({ data }) {
  return (
    <Layout>
      <LayoutDvlpt>
        <div>
          <p>
            Comme enseignant de mathématiques, j'ai utilisé en classe des documents que j'ai rédigé moi même à partir de documents déjà existants.
          </p>
          <p>
            L'objectif du projet maquisdoc est de partager ces documents et leur organisation.
          </p>
          <p>
            Les ressources présentées par maquisdoc ne seront jamais complètement satisfaisantes pour une autre personne. Toutes les sources (documents, outils d'organisation et de diffusion) sont donc accessibles et téléchargeables pour modification.
          </p>
          <p>
            Le projet ne s'intéresse pas à la gestion d'une classe ni à la monétisation des ressources. Pour autant, <em> de tels développements ne sont pas interdits. </em>  
          </p>
          <h3>Journal : {data.allMarkdownRemark.totalCount} articles</h3>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <div key={node.id}>
              <Link
                to={node.fields.slug}
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <h4
                  css={css`
                    margin-bottom: ${rhythm(1 / 4)};
                    color: darkgreen;
                  `}
                >
                  {node.frontmatter.title}{" "}
                  <span
                    css={css`
                      color: #555;
                    `}
                  >
                    — {node.frontmatter.date}
                  </span>
                </h4>
                <p>{node.excerpt}</p>
              </Link>
            </div>
          ))}
        </div>
      </LayoutDvlpt>
    </Layout> 
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(filter: {frontmatter: {theme: {eq: "journal"}}}, 
                      sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
