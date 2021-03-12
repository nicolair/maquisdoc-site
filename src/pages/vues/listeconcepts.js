import React from "react"
import { css } from "@emotion/core"
import { graphql , Link} from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"


export default function ListeConceptPage({ data }){
    return (
        <Layout>
        <LayoutVues>
        <h3> Liste des concepts </h3>
        <Link
          css={css`color: darkgreen;`}
          to="../recherche-concepts">
          Recherche par mot <small>(littéral et description)</small>
        </Link>
        <table>
          <thead>
            <tr>
              <th> litteral </th>
              <th> maquis </th>
            </tr>
          </thead>
          <tbody>
            {data.maquis.Concept.map(({litteral, _id},index)=>(
                <tr key={index}>
                  <td>{litteral}</td>
                  <td> 
                    <Link
                      css={css`color: darkgreen;`}
                      to={"/concept_"+_id}>
                      détail
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        </LayoutVues>
        </Layout>
      )
}

export const query = graphql`
  query {
    maquis {
      Concept(orderBy: litteral_asc) {
        litteral
        _id
      }
    }
  }
`
