import React from "react"
//import { Link } from "gatsby"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const ExercicePage = ({ data, pageContext}) => {
    const exo = pageContext.exo
    //console.log(exo)
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue d'un exercice </h3>
        <p>Titre : {exo.titre } </p>
        <p>Sources: <a href={exo.urlSrcEnon} 
               target="_blank"
               rel="noopener noreferrer">
            énoncé</a> </p>
        <table>
          <caption>
            Concepts évalués
          </caption>
          <tbody>
            {exo.conceptsEVAL.map(({litteral,_id},index)=>(
              <tr key={index}>
                <td>
                  <Link
                        css={css`color: darkgreen;`}
                        to={"/concept_" + _id}>
                    {litteral}
                  </Link>
                </td>
              </tr>    
            ))}
          </tbody>
        </table>
        <table>
          <caption>
            Documents contenant cet exercice
          </caption>
          <tbody>
            {exo.contenants.map(({titre,_id},index)=>(
              <tr key={index}>
                <td>
                  <Link
                        css={css`color: darkgreen;`}
                        to={"/document_" + _id}>
                    {titre}
                  </Link>
                </td>
              </tr>    
            ))}
          </tbody>
        </table>
        <div>
          <iframe src={"https://maquisdoc-math.fra1.digitaloceanspaces.com/math-exos/Aexo_" + exo.titre + ".html"} title="dummy" style={{width:'800px',height:'600px'}}></iframe>
        </div>

        </LayoutVues>
        </Layout>
    )
}

export default ExercicePage
