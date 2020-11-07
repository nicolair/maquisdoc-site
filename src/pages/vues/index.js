import React from "react"
//import { rhythm } from "../../utils/typography"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"

export default function Vues({ data }) {
  return (
    <Layout>
      <LayoutVues>
        <div>
          <p>
            Maquisdoc présente des centaines de documents.<br/>
            Une vue présente une partie de ces documents.
          </p>
          <p>
            Le projet ne s'intéresse pas à la gestion d'une classe ni à la monétisation des ressources. Pour autant, <em> de tels développements ne sont pas interdits. </em>  
          </p>
        </div>
      </LayoutVues>
    </Layout> 
  )
}
