import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const ConceptPage = ({ data, pageContext}) => {
    const concept = pageContext.concept
    const conceptsvoisins = concept.conceptsvoisins
    conceptsvoisins.sort((ca,cb)=>{
      if (ca.conceptLitteral <= cb.conceptLitteral)
        return -1
      else
        return 1
    })
    const docsvoisins = concept.documentsvoisins
    docsvoisins.sort((doca,docb) =>{
      if (doca.typeRel < docb.typeRel)
        {return -1}
      else if ((doca.typeRel = docb.typeRel) && (doca.docTitre < docb.docTitre))
        {return -1}
      else 
        {return 1} 
    })
    console.log(conceptsvoisins)
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
            {conceptsvoisins.map(({conceptLitteral,out,typeRel,conceptId},index)=>(
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
            {docsvoisins.map(({typeRel,out,docType,docTitre,docId,docUrl},index)=>(
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
