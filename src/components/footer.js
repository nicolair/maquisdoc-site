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

import { Link } from 'gatsby'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: theme.spacing(2),
    backgroundColor: '#CCCCFF',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  sitemap: {
    marginBottom: theme.spacing(2)
  },
  copyright: {
    marginTop: theme.spacing(2)
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function Footer() {
  const classes = useStyles();

  return (
    <Box
      className={classes.root}
      width={'100%'}
      paddingX={{ xs: 2, sm: 3, lg: 4 }}
      component='footer'
    >
      <Grid className={classes.sitemap} container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography>Développement</Typography>
            <List>
              <ListItemLink href="/developpement/markdown/principes/">
                Principes
              </ListItemLink>
              <ListItemLink href="/developpement/markdown/depots/">
                Dépôts
              </ListItemLink>
              <ListItemLink href="/developpement/markdown/maintenance/">
                Maintenance
              </ListItemLink>
              <ListItemLink href="/developpement/markdown/site/">
                Site web - vues
              </ListItemLink>
              <ListItemLink href="/developpement/markdown/docexterne/">
                Documentation externe
              </ListItemLink>
              <ListItemLink href="/developpement/markdown/licences/">
                Licence
              </ListItemLink>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography>Vues</Typography>
            <List>
              <ListItemLink href="/vues/problemes">Problèmes</ListItemLink>
              <ListItemLink href="/vues/feuilles/">Exercices</ListItemLink>
              <ListItemLink href="/vues/afaire/">Cours</ListItemLink>
              <ListItemLink href="/vues/afaire/">Rapidexo</ListItemLink>
            </List>
          </Paper>
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
              ©Maquisdoc {new Date().getFullYear()}
            </Typography>
            <Link rel="license" href="http://creativecommons.org/licenses/by/4.0/" css={css`
              color: darkgreen;
            `}>
              <img alt="Licence Creative Commons" src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg" />
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
