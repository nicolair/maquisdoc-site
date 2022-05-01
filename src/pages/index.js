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
          Ce site est en développement, <a href="http://81.28.96.244/v-1/index.php?login=1" target="_blank" rel="noreferrer"> l'ancienne version</a> est toujours accessible mais n'est plus maintenue et contient des liens brisés.
        </p>
      </div>
    </Layout> 
  )
}
