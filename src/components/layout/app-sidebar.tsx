import { AppBar, Box, Container, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { grey } from '@material-ui/core/colors';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      root:{
        minHeight: "100vh",
      },
    sideBarContainer:{
        backgroundColor: "#C184DA"
    },
    children:{
        width: "100%",
        background: grey[100]
    }
  })
);

const SideBar: React.FC=({children})=>{
    const classes = useStyles();
    return (
        <Grid container xs={12} className={classes.root}>
          <Grid item  xs={3} className={classes.sideBarContainer}>
            Sidebaqr
          </Grid>
          <Grid item xs={9} className={classes.children}>{children}</Grid>
        </Grid>
   
    );
}

export default SideBar