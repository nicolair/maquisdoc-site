import React from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function feuilles({ data }) {
  console.log(data)
  
  return (
    <Layout>
    <LayoutVues>
      <div>
        <h3>Feuilles d'exercices</h3>
        <table>
          <thead>
            <tr>
              <th>code</th>
              <th>Thème</th>
            </tr>
          </thead>
          <tbody>
            {data.allCodesCsv.edges.map(({ node }, index) => (
              <tr key={index}>
                <td>{node.code}</td>
                <td>
                  <a
                    css={css`
                      color: darkgreen;
                    `}
                    href = { data.site.siteMetadata.math_exos.url_diff  +  'A_' + node.code + '.pdf'} 
                    target="_blank" rel="noopener noreferrer">
                    {node.theme} 
                  </a>
                </td>
              </tr>
             ))}
          </tbody>
        </table>
      </div>
    </LayoutVues>
    </Layout>
  )
}

export const query = graphql`
  query {
    allCodesCsv {
      edges {
        node {
          code
          theme
        }
      }
    }
    site {
      siteMetadata {
        math_exos {
          url_diff
        }
      }
    }
  }
`
