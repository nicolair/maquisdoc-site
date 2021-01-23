import React from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function problèmes({ data }){
    return (
        <Layout>
        <h1> Vue problèmes </h1>
        <table>
          <tbody>
            {data.maquis.problemedocuments.map(({titre, description,url},index)=>(
                <tr key={index}>
                  <td> <small>{titre}</small> </td>
                  <td> {description} </td>
                  <td> 
                    <a 
                      css={css`color:darkgreen;`}
                      href= {url}
                      target="blank"
                      rel="noopener noreferrer"
                    >
                      url
                    </a>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
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
