
import { AppBar, Avatar, Box, Button, ButtonBase, Container, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { grey } from '@material-ui/core/colors';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import theme from '../../styles/theme';
import LogoSection from './header/logoSection';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: "100vh",
    },
    navBarContainer: {
      background: grey[500],
      bgcolor: theme.palette.background.default,
      transition:  theme.transitions.create('width')
    },
    children: {
      width: "100%",
      background: grey[500],
    },

    buttonAvatar:{
      borderRadius: '100%',
       overflow: 'hidden'
    },

    avatar:{
      transition: 'all .2s ease-in-out',
      background: theme.palette.secondary.light,
      color: theme.palette.secondary.dark,
      '&:hover': {
          background: theme.palette.secondary.dark,
          color: theme.palette.secondary.light
      }
    }
  })
);

const NavBar:React.FC = ({children})=>{

    const classes = useStyles();

    return (
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          className={classes.navBarContainer}
        >
          <Box
            sx={{
              width: 228,
              display: "flex",
              [theme.breakpoints.down("md")]: {
                width: "auto",
              },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
            >
              <LogoSection />
            </Box>
            <ButtonBase
              className={classes.buttonAvatar}
              // sx={{ borderRadius: '12px', overflow: 'hidden' }}
            >
              <Avatar
                className={classes.avatar}
                variant="rounded"
                color="inherit"
              >
                {/* <IconMenu2 stroke={1.5} size="1.3rem" /> */}
              </Avatar>
            </ButtonBase>
          </Box>
        </AppBar>
        {children}
      </Box>
    );
}

export default NavBar;