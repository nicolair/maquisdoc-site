import React from "react"
import { css } from "@emotion/core"
import { graphql , Link} from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

const urlObj = require('url')

export default function ListeCoursPage({ data }){
    return (
        <Layout>
        <LayoutVues>
        <h3> Textes de cours </h3>
        <Link
          css={css`color: darkgreen;`}
          to="../recherche-cours">
          Recherche par mot <small>(titre et description)</small>
        </Link>
        <table>
          <thead>
            <tr>
              <th> titre </th>
              <th> pdf </th>
              <th> maquis </th>
            </tr>
          </thead>
          <tbody>
            {data.maquis.coursdocuments.map(({titre, url},index)=>(
                <tr key={index}>
                  <td>{titre}</td>
                  <td> 
                    <a 
                      css={css`color:darkgreen;`}
                      href= {url}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      <small>lien</small>
                    </a>
                  </td>
                  <td>
                    <Link 
                      css={css`color: darkgreen;`}
                      to= {urlObj.parse(url,true).pathname.replace('.pdf','')}>
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
      coursdocuments(orderBy: titre_asc) {
        titre
        url
      }
    }
  }
`
