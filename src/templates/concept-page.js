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
        <table>
          <caption>
            Concepts voisins
          </caption>
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
        <table>
          <caption>
            Documents voisins
          </caption>
          <tbody>
            {concept.documentsvoisins.map(({typeRel,out,docType,docTitre,docId,docUrl},index)=>(
              <tr key={index}>
                <td>
                  {out ?
                      concept.litteral:
                      <Link
                          css={css`color: darkgreen;`}
                          to={"/document_" + docId}>
                        {docTitre}
                      </Link>
                  }
                </td>
                <td> {docType} </td>
                <td>{typeRel} </td>
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
