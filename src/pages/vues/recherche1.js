import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

import {useLazyQuery, gql } from "@apollo/client"

const GET_PBS_QUERY = gql`
  query getPbs($mot : String){
    searchpbs(mot: $mot){
      titre,
      description,
      url
    }  
  }
`

export default function RecherchePage({ data }) {
  const [getPbs, { loading, data: pbsData}] = useLazyQuery(GET_PBS_QUERY)
  
  const onChercherCliqué = e => {
    const mot_a_chercher = document.getElementById("mot_a_chercher").value
    getPbs({ variables:{mot:mot_a_chercher}})
    //console.log(mot_a_chercher)
    //console.log(pbsData)
  }
  
  return (
      <Layout>
      <LayoutVues>
        <h2> Recherche dans les problèmes</h2> {loading}
        <input type="text" id="mot_a_chercher"/>
        <button onClick={onChercherCliqué}>
            Chercher
        </button>
        <table>
          <thead>
            <tr>
              <th> description</th>
              <th> nom/lien pdf</th>
              <th> détail </th>
            </tr>
          </thead>
          <tbody>
            { (pbsData) && pbsData.searchpbs.map(({titre, description,url},index)=>(
              <tr key={index}>
                <td> {description} </td>
                <td> 
                  <a 
                      css={css`color:darkgreen;`}
                      href= {url}
                      target="blank"
                      rel="noopener noreferrer">
                    <small>{titre}</small>
                  </a>
                </td>
                <td>
                  <Link 
                    css={css`color: darkgreen;`}
                    to={"/probleme_" + titre}>
                    <small>relations</small>
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

