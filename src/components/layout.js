import React from "react"
import { css } from "@emotion/core"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"
import Footer from "./footer"

export default function Layout({ children }) {
    const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title,
            math_exos {
                url_diff
            }
          }
        }
      }
    `
  )
  return (
    <div>
      <div
        css={css`
          margin: 0 auto;
          max-width: 700px;
          padding: ${rhythm(2)};
          padding-top: ${rhythm(1.5)};
        `}
      >
          <Link to={`/`}>
            <h1
              css={css`
                margin-bottom: ${rhythm(2)};
                display: inline-block;
                font-style: normal;
                color: darkgreen;
              `}
            >
              {data.site.siteMetadata.title}
            </h1>
          </Link>
          <ul css={css`
                  float: right;
                  list-style-type: none;
                  `}> 
              <div>
                <Link 
                  css={css`
                      color: darkgreen;
                      `}
                  to= "/developpement"
                >
                  Développement
                </Link>
              </div>
              <div>
                <Link
                  css={css`
                      color: darkgreen;
                      `}
                  to= "/vues"
                >
                  Vues
                </Link>
              </div>
          </ul>
        {children}
        </div>
        <p/><p/>
      <Footer />
    </div>
    
  )
}

