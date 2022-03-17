import React  from 'react'
import 'katex/dist/katex.min.css'
import Latex from "react-latex-next"

const echapp = latex => {
    var ch = latex.replace(/\\bigskip/g,'')
    ch = ch.replace('/','//')
    ch = ch.replace(/{\\'e}/g,'é')
    ch = ch.replace(/\\'e/g,'é')
    ch = ch.replace(/\\'E/g,'É')
    ch = ch.replace(/\\'{E}/g,'É')
    ch = ch.replace(/{\\'E}/g,'É')
    ch = ch.replace(/\\'{e}/g,'é')
    ch = ch.replace(/{\\`a}/g,'à')
    ch = ch.replace(/\\`a/g,'à')
    ch = ch.replace(/\\`{a}/g,'à')
    ch = ch.replace(/\\begin{displaymath}/g,'\\[')
    ch = ch.replace(/\\end{displaymath}/g,'\\]')
    ch = ch.replace(/\\begin{quote}/g,"<p>")
    ch = ch.replace(/\\end{quote}/g,'</p>')
    ch = ch.replace(/\\newline/g,'<br>')
    ch = ch.replace(/multline/g,'align')
    return ch
}

export default function LatexBlock(props){
  const latex = echapp(props.latex)
  const delimiters = [
    { left: '$$', right: '$$', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\begin{align*}', right: '\\end{align*}', display: true },
  ]
  return (
    <div className="LatexBlock">
      <div>
        <Latex delimiters={delimiters}>{latex}</Latex>
      </div>
    </div>
  );
}
