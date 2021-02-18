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
            Maquisdoc contient des centaines de documents.<br/>
            Chaque vue présente une partie de ces documents.
          </p>
        </div>
      </LayoutVues>
    </Layout> 
  )
}
