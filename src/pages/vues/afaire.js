import React from "react"
import { css } from "@emotion/core"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function Afaire({ data }) {
  return (
    <Layout>
    <LayoutVues>
      <div>
        <h1
          css={css`
            display: inline-block;
            border-bottom: 1px solid;
          `}
        >
          A faire
        </h1>
        <p>
          Page d'attente à remplacer 
        </p>
      </div>
    </LayoutVues>
    </Layout> 
  )
}
