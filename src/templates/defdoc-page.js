import React from "react"
//import { Link } from "gatsby"
import { css } from "@emotion/core"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const DefDocPage = ({ data, pageContext}) => {
    const doc = pageContext.doc
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue document par défaut </h3>
        <p>Titre : {doc.titre } </p>
        <p> Type de document: {doc.typeDoc}</p>
        <p>
          {(doc.url) ? 
              <a css={css`color:darkgreen;`}
                 href= {doc.url}
                 target="blank"
                 rel="noopener noreferrer">
                      <small>lien</small>
              </a> :
              "" 
          }
        </p>
        </LayoutVues>
        </Layout>
    )
}

export default DefDocPage
