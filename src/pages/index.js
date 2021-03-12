import React from "react"
//import { css } from "@emotion/core"
import Layout from "../components/layout"

export default function Home({ data }) {
  return (
    <Layout>
      <div>
        <p>
          Maquisdoc est un projet d'organisation et de diffusion de documents pédagogiques.
        </p>
        <p>
          Ce site présente des documents pédagogiques (lien Vues du menu) ainsi que leur organisation et les outils pour les diffuser (lien Développement).
        </p>
        <p>
          Les documents proposés portent essentiellement sur les mathématiques en classe de mpsi (analogue en France à une première année d'université).<br/>
          Ils peuvent servir à la préparation d'un concours d'enseignement (capes ou agrégation).
        </p>
        <p>
          Ce site est en développement et ne présente pas encore tous les documents. Ils sont toujours accessibles par <a href="http://back.maquisdoc.net/v-1/index.php?login=1" target="_blank" rel="noreferrer">l'ancien site du projet</a>.
        </p>
      </div>
    </Layout> 
  )
}
