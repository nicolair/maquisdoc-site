import React, {useState }  from "react"
import { css } from "@emotion/core"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import LayoutVues from "../../components/layoutvues"
import { useFormik } from "formik"
import { usePromiseTracker, trackPromise } from "react-promise-tracker"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {ThreeDots} from "react-loader-spinner"
import LatexBlock from "../../components/latexblock"

  export const CompilIndicator = props => {
      const { promiseInProgress } = usePromiseTracker();
      return (
          promiseInProgress &&
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            Compilation ... Création des liens ... C'est assez long ... &nbsp; 
            <ThreeDots color="darkgreen" height="50" width="50" />
          </div>
      );    
  };


const RapidexoPage = ({ data })=> {
  /*
   Plusieurs états pour gérer l'application
     *roleState: valeur parmi 'choixliste',
       'choixvisu', 'lien pdf', 'visulatex'
     *listeRefsState: valeur liste de 30 chemins vers les fichiers
     *pdfUrlState: url du fichier pdf compilé à télécharger
     *numState: numéro de 0 à 30 de l'exercice courant
     *latexState: le code de l'exercice courant
  */
//const flaskServerUrl = `http://127.0.0.1:5000`;
//const flaskServerUrl = process.env.FLASK_URL
  const  flaskServerUrl = data.site.siteMetadata.servers.latexgithub.url

  const latexonline = "https://latexonline.cc/compile?url="

  const themes = {        
    'Calcloc':{'nom':'Calcul local','nb':0},
    'Courbpar':{'nom':'Courbes paramétrées','nb':0},
    'Ctrigus':{'nom':'Calcul trigonométrique','nb':0},
    'Deriv':{'nom':'Dérivation','nb':0},
    'Equadiff':{'nom':'Équations differentielles','nb':0},
    'Fracrat':{'nom':'Fractions rationnelles','nb':0},
    'Geomel':{'nom':'Géométrie élémentaire','nb':0},
    'Integ':{'nom':'Intégration','nb':0},
    'LinMat':{'nom':'Matrices','nb':0},
    'Lineuc':{'nom':'Algèbre linéaire euclidienne','nb':0},
    'Polynom':{'nom':'Polynômes','nb':0},
    'Systlin':{'nom':'Systèmes linéaires','nb':0},
    'Vocens':{'nom':'Vocabulaire ensembliste','nb':0}
  }
  const themeslist = []
  const initval = {}
  for (let theme in themes){
    initval[theme] = themes[theme]['nb']
    themeslist.push(theme)
  }

  const [roleState,setRole] = useState(0)
  const [listeRefsState,setlisteRefs] = useState([])
  const [pdfUrlState,setpdfUrl] = useState('')
  const [pdfUrlCorrState,setpdfCorrUrl] = useState('')
  const [numState,setNum] = useState(0)
  const [latexState,setLatex] = useState('')
  
  
  const fetchREFS = data => {
      var getUrl = new URL(flaskServerUrl + '/getREFS')
      var params = formik.values
      Object.keys(params).forEach(key =>
          getUrl.searchParams.append(key,params[key])
      )
      //alert(JSON.stringify(formik.values))
      fetch( getUrl, {
          method: 'GET'}
          //mode: 'cors'}
      )
        .then(response => response.text())
        .then(function(resp){
           //console.log(resp);
           let lili = JSON.parse(resp)
           setlisteRefs(JSON.parse(resp));
           fetchLATEX(lili[0]);
           setRole(1)
          })
         .catch(function(error){
            console.log('tagada ' +flaskServerUrl+' ' + error);  
          })
  };
  
  const fetchCOMPIL = data => {
      var getUrl = new URL(flaskServerUrl + '/getCOMPIL')
      setRole('w')
      //alert('coucou de getCOMPIL', roleState)
      trackPromise(
      fetch( getUrl, {
          method: 'post',
          headers: {
              'Content-Type':'application/json'
          },
          body: JSON.stringify(listeRefsState)
      }))
        .then(resp => resp.json())
        .then(function(resp){
           //console.log(resp['latex_urlstr']);
           const pdfUrl = latexonline 
                        + flaskServerUrl
                        + '/getPDF/'
                        + resp['id_session'];
           setpdfUrl(pdfUrl);
           const pdfCorrUrl = latexonline 
                        + flaskServerUrl
                        + '/getCorrPDF/'
                        + resp['id_session'];
           setpdfCorrUrl(pdfCorrUrl);
           setRole(2)
          })
         .catch(function(error){
            console.log(error);  
          })
  };

  const pdfANCHOR = () => {
        return (
          <React.Fragment>
            Télécharger &nbsp;
            <a
               onClick= {()=>setRole(3)}
               href= {pdfUrlState}
               target= "_blank"
               rel= "noreferrer"
               download>
                 énoncé pdf
            </a>
            &nbsp; &nbsp;
            <a
              onClick= {()=>setRole(3)}
              href= {pdfUrlCorrState}
              target= "_blank"
              rel= "noreferrer"
              download>
                corrigé pdf 
            </a>
          </React.Fragment>)    
  };

  const validate = values => {
      const errors = {};
      let nbtotexos = 0;
      for (let key in values){
        nbtotexos += values[key];
      }
      if ( nbtotexos !== 30){
          errors.somme = "Le nombre total d'exercices doit être 30."
      }
      return errors;
  };
  
  const formik = useFormik({
    initialValues:initval,
    validate,
    onSubmit: fetchREFS
  });
 
  const themesINPUT = (bool) =>  {
      if (bool){ 
          return ( 
            <div>
              {"Pour chaque thème, choisir un nombre d'exercices. La somme de ces nombres doit être 30."}
              <form onSubmit={formik.handleSubmit}>
              {formik.errors.somme}

              {themeslist.map( codetheme => 
                  <p key={codetheme + "paragraph"}> {themes[codetheme]['nom']}
                  <input
                    type="number"
                    key= {codetheme}
                    name={codetheme}
                    value={formik.values[codetheme]}
                    onChange={formik.handleChange}
                  />
                  </p>)
              }
              <button type="submit"> Soumettre </button>
            </form>
            </div>
          )
      }
  };
 
  const listeMENU = (bool) => {
      if (bool) {
          //fetchLATEX(listeRefsState[numState]);
          return (
            <React.Fragment>
                <p> Une liste de 30 exercices a été formée.
                {listeBUTTON()}</p>
                <p>Pour cette liste: </p> 
                {compil[roleState]()}
                <p/>
                {visuDIV(true)}
            </React.Fragment>
          )
      }
  };
  
  const fetchLATEX = (ref) => {
      var getUrl = new URL(flaskServerUrl + '/LATEX' );
      
      fetch( getUrl, {
          method: 'POST',
          headers: {
              'Content-Type':'application/json'
          },
          body: JSON.stringify(ref)
    }
      )
        .then(response => response.text())
        .then(function(resp){
           //console.log(resp);
           setLatex(resp)
          })
         .catch(function(error){
            console.log(error);  
          })
  };

  /*
  const chaineLatex = "$e^x$"
  class RapidexoLatex extends React.Component {
      constructor(props) {
          super(props);
          console.log('constructor de RapidexoLatex');
          console.log(props);
      }
      render() {
          return (
              <Latex> TAGADA  {chaineLatex} </Latex>
          )
      }
  }
  */
  
  const visuDIV = (bool) => {
      if (bool) {
        const listeRefs = listeRefsState
        const suiv = num => {
            let n = numState;
            n = (n + 1) % 30;
            fetchLATEX(listeRefs[n]);
            setNum((num) => (num + 1) % 30);
            
        }
        const prec = num => {
            let n = numState;
            n = (n + 29) % 30;
            fetchLATEX(listeRefs[n]);
            setNum((num) => (num + 29) % 30)
        }
        return (
          <div>
            <p>Visualisation des 30 exercices un par un</p>
            <p>Exercice numéro {numState}: {listeRefs[numState]}</p>
            <LatexBlock latex={latexState}/>
            &nbsp;
            <p> 
              <small> Cette vue est encore en développement. Comme la compilation en html n'est pas toujours correcte, le code Latex est présenté au dessous</small> <br/>
              <small> {latexState} </small>
            </p>
            
            <button onClick={suiv}> Suivant </button>
            <button onClick={prec}> Précédent </button>
            
          </div>
        )
      }
  };
  
  const compilBUTTON = () => {
        return (
            <button  onClick= {fetchCOMPIL}>
            Compiler feuille complète </button>
        )
  };

  const compil = { 1: compilBUTTON, 
                   2: pdfANCHOR, 
                   3: () => { return ('')} } 

  const listeBUTTON = () => {
        return (
            <button onClick= {()=>setRole(0)}> 
            Nouvelle liste
            </button>
        )
  };
  
      
  return (
    <Layout>
    <LayoutVues>
      <div>
        <h3
          css={css`
            display: inline-block;
            border-bottom: 1px solid;
          `}
        >
          Rapidexo
        </h3>
        <p>Cette vue permet de former des listes de 30 petits exercices techniques ("rapidexos") à traiter en une heure.</p>
        {themesINPUT(roleState === 0)}
        {listeMENU(roleState > 0)}
        <CompilIndicator/>
      </div>
    </LayoutVues>
    </Layout> 
  )
}

export default RapidexoPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        servers {
          latexgithub {
              url
          }
        }
      }
    }
  }
`
