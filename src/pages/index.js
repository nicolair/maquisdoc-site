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
          Il présente des documents pédagogiques (lien Vues du menu) ainsi que leur organisation et les outils pour les diffuser (lien Développement).
        </p>
        <p>
          Les documents proposés portent essentiellement sur les mathématiques en classe de mpsi (analogue en France à une première année d'université).<br/>
          Ils peuvent servir à la préparation d'un concours d'enseignement (capes ou agrégation).
        </p>
      </div>
    </Layout> 
  )
}
