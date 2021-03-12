import React from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const CoursPage = ({ data, pageContext}) => {
    const cours = pageContext.cours
    const concepts = cours.concepts
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue document de cours </h3>
        <p>Titre : {cours.titre } 
        <a href={cours.url} 
               target="_blank"
               rel="noopener noreferrer">
            <small> ( pdf ) </small></a>
        </p>
        <p>Concepts documentés : 
         {concepts.map(({litteral, _id}) => 
            <Link
                css={css`color: darkgreen;`}
                to={"/concept_" + _id}>
              {litteral}   
            </Link> )}
        </p>
        </LayoutVues>
        </Layout>
    )
}

export default CoursPage
