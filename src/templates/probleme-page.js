import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"

const ProblemePage = ({ data, pageContext}) => {
    const probleme = pageContext.probleme
    const utilisations = probleme.evenements
    return (
        <layout>
        <h3> Vue problème {probleme.titre}</h3>
        <p> {probleme.description}</p>
        <p> <a href={probleme.url} 
               target="_blank"
               rel="noopener noreferrer">
            lien</a>
        </p>
        <p>utilisations:
         {utilisations.map(({nom})=> ' ' + nom)}
        </p>
        </layout>
    )
}

export default ProblemePage
