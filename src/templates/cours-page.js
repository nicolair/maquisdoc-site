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
        <h3> Vue d'un document de cours </h3>
        <p>Titre : {cours.titre } </p>
        <p>
          <a href={cours.url} 
               target="_blank"
               rel="noopener noreferrer">
             Document pdf
          </a>
        </p>
        <table>
          <caption>Concepts documentés </caption>
          <tbody>
            {concepts.map(({litteral, _id},index) => 
              <tr key={index}>
                <td>
                  <Link
                    css={css`color: darkgreen;`}
                    to={"/concept_" + _id}>
                    {litteral}   
                  </Link> 
                </td>
              </tr>)}
          </tbody>
        </table>
        </LayoutVues>
        </Layout>
    )
}

export default CoursPage
