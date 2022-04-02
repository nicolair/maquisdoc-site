import React, {useState} from "react"
import { Link } from "gatsby"
import { css } from "@emotion/core"
import Layout from "../components/layout"
import LayoutVues from "../components/layoutvues"

const FeuilleExoPage = ({ data, pageContext}) => {
    const feuilleexo = pageContext.feuilleexo
    const conceptId = feuilleexo.conceptsEVAL[0]._id
    const docsvoisins = feuilleexo.conceptsEVAL[0].documentsvoisins
    const exosvoisins = docsvoisins.filter((value,index,arr)=>(
      value.docType === "exercice" && value.typeRel === "EVALUE"
    ))
    exosvoisins.sort((ob1,ob2) =>(
      ob2.docTitre < ob1.docTitre
    ))
    const nbexos = exosvoisins.length
    const [indexexoState,setindexexo] = useState(0)
    // console.log(exosvoisins[indexexoState].docUrl)
    const suiv = num => {
      setindexexo((num) => (num + 1) % nbexos)
    }
    const prec = num => {
      setindexexo((num) => (num + nbexos - 1) % nbexos)
    }
    
    return (
        <Layout>
        <LayoutVues>
        <h3> Vue d'une feuille d'exercices </h3>
        <p> Thème de la feuille :</p>
        <h4>{feuilleexo.titre}</h4> 
        <p>({nbexos} exercices sur ce thème)</p>
        <p>
          <a
            css={css`color: darkgreen;`}
            href = { feuilleexo.url} 
            target="_blank" rel="noopener noreferrer"
            >
              feuille pdf 
            </a> &nbsp;
          <Link css={css`color: darkgreen;`}
                to={"/concept_" + conceptId}>
            concept associé
          </Link> .
        </p> 
        <div> 
          Exercice courant &nbsp;
          <Link css={css`color: darkgreen;`}
                to={"/document_" + exosvoisins[indexexoState].docId}>
            {exosvoisins[indexexoState].docTitre}
          </Link>&nbsp;
          <button onClick={prec}> Précédent </button>&nbsp; 
          <button onClick={suiv}> Suivant </button>
        </div>
        <div>
          <iframe src={exosvoisins[indexexoState].docUrl} title="dummy" style={{width:'99%',height:'600px'}}></iframe>
        </div>

        </LayoutVues>
        </Layout>
    )
}

export default FeuilleExoPage
