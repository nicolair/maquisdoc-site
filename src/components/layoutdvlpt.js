import React from "react"
import { css } from "@emotion/core"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function LayoutDvlpt({ children }) {
    const data = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(filter: {frontmatter: {theme: {eq: "développement"}}},
            sort: {fields: frontmatter___rang, order: ASC}
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )
  return (
    <div>
      <h2> Développement </h2>
      <ul css={css`
          float: left;
          padding-right: ${rhythm(1.5)};
          `}>
          {data.allMarkdownRemark.edges.map( ({node}) => (
              <div key={node.id}>
                <Link
                  css={css`
                    color: darkgreen;
                    `}
                  to={node.fields.slug}
                >
                  {node.frontmatter.title}
                </Link>
              </div>
          ))}
      </ul>
      {children} 
    </div>
  )
}

