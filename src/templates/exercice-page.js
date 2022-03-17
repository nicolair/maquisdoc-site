import React from "react"
//import { Link } from "gatsby"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const ExercicePage = ({ data, pageContext}) => {
    const exo = pageContext.exo
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue exercice </h3>
        <p>Titre : {exo.titre } </p>
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
        <div>
          <iframe src={"https://maquisdoc-math.fra1.digitaloceanspaces.com/math-exos/Aexo_" + exo.titre + ".html"} title="dummy" style={{width:'800px',height:'600px'}}></iframe>
        </div>

        </LayoutVues>
        </Layout>
    )
}

export default ExercicePage
