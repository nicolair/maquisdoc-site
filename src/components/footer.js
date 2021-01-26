import React from 'react'
import { css } from "@emotion/core"
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from "@material-ui/core/Grid"
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useStaticQuery, Link } from 'gatsby'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#CADFC8',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  sitemap: {
    marginBottom: theme.spacing(2),
    fontSize: "15px",
  },
  navtitle: {
    fontWeight: 700,
  },
  copyright: {
    marginTop: theme.spacing(2)
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function ListTitleLink(props) {
  const classes = useStyles();

  return <ListItemLink className={classes.navtitle} {...props} />;
}

export default function Footer() {
  const classes = useStyles();
  const data = useStaticQuery(graphql`
    query FooterQuery {
      allMarkdownRemark(filter: {frontmatter: {theme: {eq: "développement"}}}, sort: {fields: frontmatter___rang, order: ASC}) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
      allMenuVuesCsv {
        edges {
          node {
            code
            page
            texte
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Box
      className={classes.root}
      width={'100%'}
      paddingX={{ xs: 2, sm: 3, lg: 4 }}
      component='footer'
    >
      <Grid className={classes.sitemap} container spacing={3}>
        <Grid item xs={12} md={6}>
          <ListTitleLink href="/developpement/">
              Développement
          </ListTitleLink>
          <List>
            {data.allMarkdownRemark.edges.map(({ node }) => (
              <ListItemLink href={node.fields.slug}>
                {node.frontmatter.title}
              </ListItemLink>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <ListTitleLink href="/vues/">
            Vues
          </ListTitleLink>
          <List>
            {data.allMenuVuesCsv.edges.map(({ node }) => (
              <ListItemLink href={node.page}>{node.texte}</ListItemLink>
            ))}
          </List>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className={classes.copyright}>
        <Grid item xs={12} sm={6}>
          <Box py={1} textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography
              component={'p'}
              variant={'caption'}
              color={'textSecondary'}
            >
              Fait avec ❤️ avec <Link to="https://www.gatsbyjs.com/">Gatsby</Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box py={1} textAlign={{ xs: 'center', sm: 'right' }}>
            <Typography
              component={'p'}
              variant={'caption'}
              color={'textSecondary'}
            >
              © {data.site.siteMetadata.title} {new Date().getFullYear()}
            </Typography>
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/" css={css`
              color: darkgreen;
            `}>
              <img alt="Licence Creative Commons" src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg" />
            </a>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
