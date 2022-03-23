import React from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function feuillesexercices({ data }) {
  console.log(data)
  
  return (
    <Layout>
    <LayoutVues>
      <div>
        <h3> Thèmes d'exercices </h3>
        <table>
          <thead>
            <tr>
              <th>Thème</th>
              <th>Feuille</th>
              <th>Concept</th>
            </tr>
          </thead>
          <tbody>
            {data.maquis.Document.map(( feuille , index) => (
              <tr key={index}>
                <td>{feuille.titre}</td>
                <td>
                  <a
                    css={css`
                      color: darkgreen;
                    `}
                    href = { feuille.url} 
                    target="_blank" rel="noopener noreferrer">
                    feuille pdf 
                  </a>
                </td>
                <td> 
                  <Link 
                    css={css`color: darkgreen;`}
                    to= {"/concept_"+feuille.conceptsEVAL[0]._id}>
                    concept
                  </Link> 

                </td>
              </tr>
             ))}
          </tbody>

        </table>

      </div>
    </LayoutVues>
    </Layout>
  )
}

export const query = graphql`
  query{
    maquis {
      Document(typeDoc: "liste exercices",
               orderBy: titre_asc) {
        titre
        conceptsEVAL {
          _id
          litteral
        }
        url
      }
    }
  }
`
