import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const SemainePage = ({ data, pageContext }) => {
  const { previous, next} = pageContext 
  const semaine = pageContext.semaine
  const concepts = semaine.concepts
  const q_cours = semaine.sousevenements
  
  function lien_cours(documents){
      if (documents.length >0){
          const lien = 
          ( <a href =  { documents[0].url }
           target="_blank" rel="noopener noreferrer"> (document de cours) </a> )
          return lien
      }
  }

  function lien_exos(listexos){
      if (listexos.length >0){
          const lien = 
          ( <a href =  { listexos[0].url }
           target="_blank" rel="noopener noreferrer"> (feuille d'exercices) </a> )
          return lien
      }
  }

  return (
    <Layout>
    <LayoutVues>
    <h3> Une année en mpsi B </h3>
    <h4>{pageContext.nom}</h4>
    <p>
      <a href= {semaine.documents[0].url} target="_blank" rel="noopener noreferrer">
        Programme de la semaine
      </a>
    </p>
    <p>Elle porte sur: 
    <ul>
    { concepts.map(({litteral, documents, listexos}) => 
      <li> 
        {litteral}
        {lien_cours(documents)}
        {lien_exos(listexos)}
      </li>)}
    </ul>
    </p>
    <p>
      Questions de cours
      <ul>
      {q_cours.map(({nom})=>
          <li> {nom} </li>
      )}
      </ul>
    </p>
    <nav>
      <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
        <li>
          <Link to={ previous.nom.replace('semaine ','/semaine_') }>
            {previous.nom}
          </Link>
        </li>
        <li>
          <Link to={ next.nom.replace('semaine ','/semaine_') }>
            { next.nom }
          </Link>
        </li>
      </ul>
    </nav>
    </LayoutVues>
    </Layout>
  )
}

export default SemainePage


