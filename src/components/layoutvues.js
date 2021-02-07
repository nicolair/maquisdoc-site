import React from "react"
import { css } from "@emotion/core"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function LayoutVues({ children }) {
    const data = useStaticQuery(
    graphql`
      query {
        allMenuVuesCsv {
          edges {
            node {
              code
              page
              texte
            }
          }
        }
      }
    `
  )
  return (
    <div>
      <h2> Vues </h2>
      <ul css={css`
                float: left;
                list-style-type: none;
                padding-right: ${rhythm(1.5)};
                `}> 
            {data.allMenuVuesCsv.edges.map(({ node }) => (
                <div key={node.code}>
                  <Link
                    css={css`
                      color: darkgreen;
                    `}
                    to={node.page}
                  >
                    {node.texte}
                  </Link>
                </div>
            ))}
      </ul>
      {children} 
    </div>
  )
}

