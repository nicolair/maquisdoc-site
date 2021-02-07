import React from "react"
import { css } from "@emotion/core"
import { graphql , Link} from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function ProblemesPage({ data }){
    return (
        <Layout>
        <LayoutVues>
        <h3> Problèmes </h3>
        <Link
          css={css`color: darkgreen;`}
          to="../recherche1">
          Recherche par mot <small>(nom et description)</small>
        </Link>
        <table>
          <thead>
            <tr>
              <th> description </th>
              <th> lien vers pdf </th>
              <th> maquis </th>
            </tr>
          </thead>
          <tbody>
            {data.maquis.problemedocuments.map(({titre, description,url},index)=>(
                <tr key={index}>
                  <td> {description} </td>
                  <td> 
                    <a 
                      css={css`color:darkgreen;`}
                      href= {url}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <small>{titre}</small>
                    </a>
                  </td>
                  <td>
                    <Link 
                      css={css`color: darkgreen;`}
                      to= {"/probleme_" + titre}>
                      <small> détail</small>
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
      problemedocuments(orderBy: titre_asc) {
        titre
        description
        url
      }
    }
  }
`
