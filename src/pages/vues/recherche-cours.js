import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
//import { rhythm } from "../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

import {useLazyQuery, gql } from "@apollo/client"

const urlObj = require('url')

const GET_COURS_QUERY = gql`
  query getCours($mot : String){
    searchcours(mot: $mot){
      titre,
      description,
      url
    }  
  }
`

export default function RecherchePage({ data }) {
  const [getPbs, { loading, data: coursData}] = useLazyQuery(GET_COURS_QUERY)
  
  const onChercherCliqué = e => {
    const mot_a_chercher = document.getElementById("mot_a_chercher").value
    getPbs({ variables:{mot:mot_a_chercher}})
    //console.log(mot_a_chercher)
    //console.log(pbsData)
  }
  
  return (
      <Layout>
      <LayoutVues>
        <h3> Recherche dans les textes de cours</h3> {loading}
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
            { (coursData) && coursData.searchcours.map(({titre, description,url},index)=>(
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
                    to= {urlObj.parse(url,true).pathname.replace('.pdf','')}>
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

