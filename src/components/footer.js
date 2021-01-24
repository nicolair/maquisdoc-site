import React from 'react'
import { css } from "@emotion/core"

import { rhythm } from "../utils/typography"
import { Link } from 'gatsby'

export default function Footer() {
  return (
    <footer css={css`
      background-color: #9f392b;
      padding: ${rhythm(2)};
    `}>
      <div css={css`
        float: left;
      `}>
        <p>©Maquisdoc {new Date().getFullYear()}</p>
      </div>
      <div css={css`
        float: right;
      `}>
        <Link rel="license" href="http://creativecommons.org/licenses/by/4.0/" css={css`
          color: darkgreen;
        `}>
          <img alt="Licence Creative Commons" src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
        </Link>
      </div>
    </footer>
  )
}
