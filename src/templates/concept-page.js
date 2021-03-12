import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const ConceptPage = ({ data, pageContext}) => {
    const concept = pageContext.concept
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue d'un concept </h3>
        <p>Littéral : {concept.litteral} </p>
        <p>Concepts voisins :
        </p>
        <table>
          <tbody>
            {concept.conceptsvoisins.map(({conceptLitteral,out,typeRel,conceptId},index)=>(
              <tr key={index}>
                <td>{out ? 
                        concept.litteral :
                        <Link
                            css={css`color: darkgreen;`}
                            to={"/concept_"+conceptId}>
                          {conceptLitteral}
                        </Link>}
                </td>
                <td>{typeRel}</td>
                <td>
                  {out ? 
                        <Link
                            css={css`color: darkgreen;`}
                            to={"/concept_"+conceptId}>
                          {conceptLitteral}
                        </Link> : 
                      concept.litteral 
                  }
                </td>
              </tr>    
            ))}
          </tbody>
        </table>
        <p>Documents voisins :
        </p>
        <table>
          <tbody>
            {concept.documentsvoisins.map(({typeRel,out,docTitre,docId},index)=>(
              <tr key={index}>
                <td>
                  {out ?
                      concept.litteral:
                      <Link
                          css={css`color: darkgreen;`}
                          to={"/document_"+docId}>
                        {docTitre}
                      </Link>
                  }
                </td>
                <td>{typeRel}</td>
                <td>
                  {out ? 
                      <Link
                          css={css`color: darkgreen;`}
                          to={"/document_"+docId}>
                        {docTitre}
                      </Link>:
                      concept.litteral
                  }  
                </td>
              </tr>    
            ))}
          </tbody>
        </table>
        </LayoutVues>
        </Layout>
    )
}

export default ConceptPage
