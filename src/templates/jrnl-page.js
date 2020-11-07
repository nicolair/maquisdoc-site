import React from "react"
import { css } from "@emotion/core"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import LayoutDvlpt from "../components/layoutdvlpt"

export default function JrnlArt({ data }) {
  const post = data.markdownRemark
  return (
    <Layout>
    <LayoutDvlpt>
      <div>
        <Link 
          css={css`
            text-decoration: none;
          `}
          to = "/developpement"
        >
          <h4
            css={css`
              color: darkgreen;
            `}
          >
            Journal 
          </h4>
        </Link>
        <h5>{post.frontmatter.title}</h5>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </LayoutDvlpt>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
