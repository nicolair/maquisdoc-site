import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import LayoutDvlpt from "../components/layoutdvlpt"

export default function DvlpPage({ data }) {
  const post = data.markdownRemark
  return (
    <Layout>
    <LayoutDvlpt>
      <div>
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
