import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const FeuilleExoPage = ({ data, pageContext}) => {
    const feuilleexo = pageContext.feuilleexo
    const conceptId = feuilleexo.conceptsEVAL[0]._id
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue d'une feuille d'exercices </h3>
        <p>Titre : {feuilleexo.titre } </p>
        <p>
          <a href={feuilleexo.url} 
               target="_blank"
               rel="noopener noreferrer">
             feuille pdf
          </a>
        </p>
        <p>
          <Link 
            css={css`color: darkgreen;`}
            to={"/concept_" + conceptId}>
          concept 
          </Link> du thème de la feuille.
        </p> 
        </LayoutVues>
        </Layout>
    )
}

export default FeuilleExoPage
