import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  Hidden,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { purple, grey } from "@material-ui/core/colors";
import imgLogin from "./src/asset/img/login-img.jpg";
import Image from "next/image";
import Icon from "@material-ui/core/Icon";
import { faHouseUser, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyItems: "center",
      //   paddingLeft: theme.spacing(8),
      //   paddingRight: theme.spacing(8),
      minHeight: "100vh",
      //   paddingTop: theme.spacing(16),
      //   paddingBottom: theme.spacing(16),
      background: "linear-gradient(#232526, #414345)",
    },
    cardContent: {
      width: "100%",
      //   paddingTop: theme.spacing(6),
      //   paddingBottom: theme.spacing(3),
      //   paddingLeft: theme.spacing(3),
      //   paddingRight: theme.spacing(3),
    },
    cardRoot: {
      display: "flex",
      overflow: "visible",
      position: "relative",
      width: "78%",
      // border: 0,
      // borderRadius: 30,
    },
    gridRoot: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      //   paddingTop: theme.spacing(6),
      //   paddingBottom: theme.spacing(3),
      //   paddingLeft: theme.spacing(3),
      //   paddingRight: theme.spacing(3),
      // height: "100px",
    },
    gridItem: {
      width: "100%",
    },
    loginImg: {
      maxHeight: "460px",
      height: "100%",
      overflow: "visible",
      // borderTopRightRadius: 10,
    },
    formRoot: {
      width: "100%",
      height: "100%",

      // margin: "10% 0px",
      // display: "flex",
      // alignItems: "center",
      // justifyItems: "center",
      // marginLeft: theme.spacing(10),
      // marginRight: theme.spacing(10),
      // backgroundColor: purple[100],
    },
    boxForm: {
      // display: "flex",
      // alignItems: "center",
      // justifyItems: "center",
      // backgroundColor: purple[700],

      width: "100%",
    },
    ContenedorTituloLogin: {
      paddingTop: "10%",
      width: "100%",
      textAlign: "center",
      color: grey[800],
    },
    iconoLogin: {
      fontSize: "25px",

      // color: grey[700],
    },
    tituloLogin: {
      fontWeight: "unset",
      fontSize: "18px",
      letterSpacing: "0.5px",
      padding: "10px 0px",
      // fontFamily: "cursive"
      // fontSize: 23,
      // fontFamily: theme.typography.caption.fontFamily,
      // fontWeight: "bold",

      // color: grey[700],
    },

    formContent: {
      display: "flex",
      alignItems: "center",
      justifyItems: "center",
      // marginTop: "10px",
      // backgroundColor: "red",
    },
    textInput: {
      width: "50%",
      backgroundColor: grey[200],
      marginTop: "10px",
    },
    buttonForm: {
      fontSize: "12px",
      marginTop: "30px",
      borderRadius: 40,
      width: "50%",
      marginBottom: "14%"
    },
  })
);

const LoginScreen = () => {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>Login Urba</title>
      </Head>
      <div className={classes.root}>
        <Container className={classes.cardRoot}>
          <Card className={classes.cardContent}>
            <Grid container xs={12} className={classes.gridRoot}>
              <Hidden only={["xl","xs"]}>
                <Grid item xs={12} sm={6} className={classes.gridItem}>
                  <CardMedia className={classes.loginImg}>
                    <Image
                      quality={100}
                      layout="responsive"
                      src={imgLogin}
                      alt="login"
                    />
                  </CardMedia>

                  {/* <Image layout="responsive" src={imgLogin} alt="login" /> */}
                </Grid>
              </Hidden>
              <Grid item xs={12} xl={12} sm={6}  className={classes.gridItem}>
                <Box className={classes.formRoot}>
                  <div className={classes.ContenedorTituloLogin}>
                    <FontAwesomeIcon
                      icon={faHouseUser}
                      className={classes.iconoLogin}
                    />
                    <Typography className={classes.tituloLogin}>
                     Iniciar Sesion
                    </Typography>
                  </div>

                  <div className={classes.boxForm}>
                    {/* <FormControl> */}
                    <FormGroup className={classes.formContent}>
                      <TextField
                        label="Usuario"
                        variant="outlined"
                        className={classes.textInput}
                      />
                      <TextField
                        label="Contraseña"
                        variant="outlined"
                        className={classes.textInput}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={
                          <FontAwesomeIcon
                            icon={faSignInAlt}
                            // className={classes.iconoLogin}
                          />
                        }
                        className={classes.buttonForm}
                      >
                        Ingresar
                      </Button>
                    </FormGroup>
                    {/* </FormControl> */}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default LoginScreen;
