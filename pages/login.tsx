import React, { useCallback } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,

  Grid,
  Hidden,

  TextField,
  Typography,
} from "@material-ui/core";
import { purple, grey, blueGrey, blue } from "@material-ui/core/colors";
import imgLogin from "../public/img/login-img.jpg";
import imgFamily from "../public/img/img-family.jpg";
import imgLogoLogin from '../public/img/password.png';
import TextBox from '../src/components/core/input/text-field'
import Image from "next/image";
import Icon from "@material-ui/core/Icon";
import { faUserTie, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { isNotNilOrEmpty } from "../src/utils/is-nil-empty";
import { useRouter } from "next/router";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyItems: "center",
      minHeight: "100vh",
       background: "linear-gradient(#4e54c8,#8f94fb)",
    },
    cardContent: {
      width: "100%",
      borderRadius: "2%",
    },
    cardRoot: {
      display: "flex",
      overflow: "visible",
      position: "relative",
      width: "78%",
    },
    gridRoot: {
      width: "100%",
      display: "flex",
      // backgroundColor: violet[100],
      // background: "linear-gradient(#4e54c8,#8f94fb)",
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
      // maxHeight: "460px",
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
      display: "flex",
      flexDirection: 'column',
      alignItems: "center",
      paddingTop: "10%",
      width: "100%",
      textAlign: "center",
      color: "#212121"
      // color: blueGrey[700],
      
    },
    iconoLogin: {
      // fontSize: "20px",
      // size: "10px",
      width:"90px",
      height: "90px",
      display: "flex",
      alignItems: "center",
      // height: "10px",
      // width: "10px",
      backgroundColor: "white",
      // padding: "12px",
      // borderRadius: "100%",
      // padding: "1px"
      // color: grey[700],
    },
    tituloLogin: {
      fontWeight: "bold",
      fontSize: "22px",
      letterSpacing: "3px",
      padding: "10px 0px",
      fontFamily: "Roboto"
      // fontSize: 23,
      // fontFamily: theme.typography.caption.fontFamily,
      // fontWeight: "bold",

      // color: grey[700],
    },

    formContent: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(8),
      
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // marginTop: "10px",
      // backgroundColor: "red",
    },
    textInput: {
      width: "50%",
      // backgroundColor: grey[200],
      marginTop: "10px",
    },
    buttonForm: {
      fontSize: "10px",
      marginTop: "30px",
      padding: "10px 0px",
      borderRadius: 40,
      width: "40%",
      // backgroundColor:"#AC5BCD"
    //  background: "linear-gradient(#4e54c8,#8f94fb)"
      // marginBottom: "14%"
    },
  })
);
const initialValues = Object.freeze({ usuario: '', password: '' });

const validationSchema = yup.object().shape({
  usuario: yup.string().required('Required'),
  password: yup.string().min(5, 'Too short').required('Required')
});


const LoginScreen = () => {

  const router = useRouter();

  const onSubmit = useCallback(async ({  usuario, password }, { setSubmitting }) => {
    try {
      return router.push('home/user')
      console.log("user: ",usuario,"password",password)
      // Reset error state before attempting to login
    //   setFailedLoginError(null);

    //   const { user } = await authenticate(email, password);

    //   // Set recently logged in user information in the `AuthContext`
    //   // and alert other pages of the authentipauthcation status change
    //   setUser(user);

    //   if (isNil(router?.query.return)) {
    //     // If we don't have a callback path where to return (e.g.: `?return=`), send
    //     // users to My Cases page
    //     return router.push('/my-cases');
    //   }

    //   // Go back to where we came after a successful login
    //   return router.push(router.query.return);
    } catch (err) {
    //   const failedLoginError = isBadRequestError(err)
    //     ? 'Missing username or password'
    //     : isAuthorizationError(err)
    //     ? 'Wrong username or password'
    //     : undefined;

    //   setSubmitting(false);
    //   // Show an error message on known authentication issues (like bad username/password)
    //   // or an alert dialog for unexpected messages
    //   setFailedLoginError(failedLoginError);
    //   setAlertOpen(failedLoginError === undefined);
    //   setAlertDetails(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    errors,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    touched,
    values
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  });

  const classes = useStyles();
  return (
    <>
      <Head>
        <title>Login Urba</title>
      </Head>
      <div className={classes.root}>
        
        <Container className={classes.cardRoot}>
          <Card className={classes.cardContent}>
            <Grid container   className={classes.gridRoot}>
              <Hidden smDown>
                <Grid item  md={6} lg={6} className={classes.gridItem}>
                  <CardMedia className={classes.loginImg}>
                    <Image
                     className={classes.loginImg}
                      layout="responsive"
                      src={imgFamily}
                      alt="login"
                    />
                  </CardMedia>

                  {/* <Image layout="responsive" src={imgLogin} alt="login" /> */}
                </Grid>
              </Hidden>
              <Grid item sm={12}  md={6} lg={6} className={classes.gridItem}>
                <Box className={classes.formRoot}>
                  <div className={classes.ContenedorTituloLogin}>
                    {/* <div> */}
                      <CardMedia className={classes.iconoLogin} >
                      <Image   src={imgLogoLogin} alt="login-logo">

                      </Image>
                      </CardMedia>
                      
                    {/* <FontAwesomeIcon
                      icon={faUserTie}
                      className={classes.iconoLogin}
                    /> */}
                    {/* </div> */}
                    
                    <Typography className={classes.tituloLogin}>
                     Iniciar Sesion
                    </Typography>
                  </div>

                  <div className={classes.boxForm}>
                    {/* <FormControl> */}
                    <form 
                    action="#"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    noValidate
                   className={classes.formContent}>
                      <TextField
                      // id="usuario"
                        // label="Usuario"
                        // variant="outlined"
                        className={classes.textInput}
                        id="usuario"
                        value={values.usuario}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="username"
                        label="Email"
                        margin="normal"
                        error={touched.usuario && isNotNilOrEmpty(errors.usuario)}
                        helperText={touched.usuario ? errors.usuario : undefined}
                        required
                        fullWidth
                      />
                      <TextField
                      //   id="password"
                      //   label="Contraseña"
                      //   variant="outlined"
                        className={classes.textInput}
                        id="password"
                        type={"password"}
                        // className="mt3"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        label="Password"
                        margin="normal"
                        error={touched.password && isNotNilOrEmpty(errors.password)}
                        helperText={touched.password ? errors.password : undefined}
                        required
                        fullWidth
                      //
               
                       />
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                       
                        className={classes.buttonForm}
                      >
                        Ingresar
                      </Button>
                    </form>
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
