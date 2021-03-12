import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

import {useLazyQuery, gql } from "@apollo/client"

const GET_CONCEPTS_QUERY = gql`
  query getConcepts($mot : String){
    searchconcepts(mot: $mot){
      litteral,
      description,
      _id
    }  
  }
`

export default function RecherchePage({ data }) {
  const [getCncpts, { loading, data: conceptsData}] = useLazyQuery(GET_CONCEPTS_QUERY)
  
  const onChercherCliqué = e => {
    const mot_a_chercher = document.getElementById("mot_a_chercher").value
    getCncpts({ variables:{mot:mot_a_chercher}})
    //console.log(mot_a_chercher)
    //console.log(pbsData)
  }
  
  return (
      <Layout>
      <LayoutVues>
        <h3> Recherche dans les concepts</h3> {loading}
        <input type="text" id="mot_a_chercher"/>
        <button onClick={onChercherCliqué}>
            Chercher
        </button>
        <table>
          <tbody>
            { (conceptsData) && conceptsData.searchconcepts.map(({litteral, description,_id},index)=>(
              <tr key={index}>
                <td>
                  <Link 
                       css={css`color: darkgreen;`}
                       to= {"/concept_"+_id}>
                    {litteral}
                  </Link> 
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </LayoutVues>
      </Layout>
  )
}

