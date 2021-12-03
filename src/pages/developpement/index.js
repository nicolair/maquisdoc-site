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
            Cette partie du site documente l'organisation des données et les applications qui les gèrent.
          </p>
          <p>
            Le projet est en développement et le développeur en apprentissage.<br/> 
            
            Un <a href="https://github.com/users/nicolair/projects/1" target="_blank" rel="noreferrer">tableau de progression</a> est présenté sur GitHub.<br/>
            Le journal suivant présente des remarques qui ont ponctué cette progression.
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
