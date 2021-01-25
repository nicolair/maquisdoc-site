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

import { rhythm } from "../utils/typography"
import { Link } from 'gatsby'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

export default function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.root} width={'100%'} px={{ xs: 2, sm: 3, lg: 4 }}>
      <Grid className={classes.sitemap} container spacing={3}>
        {/*<div>
          <Link rel="license" href="http://creativecommons.org/licenses/by/4.0/" css={css`
            color: darkgreen;
          `}>
            <img alt="Licence Creative Commons" src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg" />
          </Link>
        </div> */}
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Typography>Développement</Typography>
            <List>
              <ListItem button>Principes</ListItem>
              <ListItem button>Dépôts</ListItem>
              <ListItem button>Maintenance</ListItem>
              <ListItem button>Site web - vues</ListItem>
              <ListItem button>Documentation externe</ListItem>
              <ListItem button>Licence</ListItem>
              <ListItem button>l'ancien site du projet</ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
          <Typography>Vues</Typography>
            <List>
              <ListItem button>Problèmes</ListItem>
              <ListItem button>Exercices</ListItem>
              <ListItem button>Cours</ListItem>
              <ListItem button>Exos</ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Divider />
      <Grid className={classes.copyright} item xs={12}>
        <Paper className={classes.paper}>
          <Box py={1} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography
              component={'p'}
              variant={'caption'}
              color={'textSecondary'}
            >
              Fait avec ❤️ avec <Link to="https://www.gatsbyjs.com/">Gatsby</Link>
            </Typography>
          </Box>
          <Box py={1} textAlign={{ xs: 'center', md: 'right' }}>
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
        </Paper>
      </Grid>
    </Box>
    
      
  )
}
