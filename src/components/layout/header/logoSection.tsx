// import { Link } from 'react-router-dom';

// material-ui
import { grey } from '@material-ui/core/colors';
//import makeStyles from '@material-ui/core/styles/makeStyles';
import { makeStyles, ButtonBase, CardMedia, createStyles, Theme, Typography } from '@material-ui/core';

// project imports
// import config from 'config';
// import Logo from 'ui-component/Logo';
import Image from "next/image";
import imgLogo from '../../../../public/img/logoNavbar.png'
import { borderRadius } from '@mui/system';

// ==============================|| MAIN LOGO ||============================== //


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      root:{
          display: "flex",
        //   height:"100%",
        //   margin: "10px",
          borderRadius: "30%"
          
        //   background: grey[100]
        // height:
      },
    sideBarContainer:{
        backgroundColor: "#C184DA"
    },
    children:{
        width: "100%",
        background: grey[100]
    },
    cardMedia:{
        display: "flex",
        height:"40px",
        width: "40px"

    }
  })
);

const LogoSection = () => {
    const classes = useStyles()
    return (
      <>
        {" "}
        <ButtonBase className={classes.root} >
          <CardMedia  className={classes.cardMedia}>
            <Image src={imgLogo}></Image>
          </CardMedia>
            <Typography variant='h5'> Urb </Typography>
          {/*        
        <Logo /> */}
        </ButtonBase>
      </>
    );
}

   


export default LogoSection;