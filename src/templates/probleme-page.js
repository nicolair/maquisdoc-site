import React from "react"
//import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const ProblemePage = ({ data, pageContext}) => {
    const probleme = pageContext.probleme
    const utilisations = probleme.evenements
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue problème {probleme.titre}</h3>
        <p> {probleme.description}</p>
        <p> <a href={probleme.url} 
               target="_blank"
               rel="noopener noreferrer">
            pdf</a> &nbsp;
            Sources: <a href={probleme.urlSrcEnon} 
               target="_blank"
               rel="noopener noreferrer">
            énoncé</a>, <a href={probleme.urlSrcCorr} 
               target="_blank"
               rel="noopener noreferrer">
            corrigé</a>
        </p>
        <p>utilisations:
         {utilisations.map(({nom})=> ' ' + nom)}
        </p>
        </LayoutVues>
        </Layout>
    )
}

export default ProblemePage
