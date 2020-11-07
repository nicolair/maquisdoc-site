---
theme: "journal"
title: "Filtre glob de graphql"
date: "2020-11-01"
---

La syntaxe du filtre glob n'est pas claire. Quelle différence entre * et ** ?

query MyQuery {

  allFile(filter: {absolutePath: {glob: "**/developpement/**"}}) {
  
    edges {
    
      node {
      
        absolutePath
        
      }
    }
  }
}


Une * = n'importe quel caractère ?

Deux * = n'importe quelle chaine ?
