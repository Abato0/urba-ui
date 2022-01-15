import React, { useCallback, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  colors,
  Grid,
  Hidden,

  TextField,
  Typography,
} from "@material-ui/core";
import Image from "next/image";;
import * as yup from 'yup';
import { useFormik } from 'formik';
import { isNotNilOrEmpty, isNilOrEmpty } from '../utils/is-nil-empty';
import { useRouter } from "next/router";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { login } from "../auth/auth-service"
import { useSetRecoilState} from 'recoil'
import { userInfo } from '../utils/states';
import ModalAuth from "../components/core/input/dialog/modal-dialog";
import { EnlacesSidebar } from "../components/layout/app-sidebar";
// import bcrypt from 'bcrypt'


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyItems: "center",
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    minHeight: "100vh",
    minWidth:"500px",
    backgroundColor: colors.blueGrey[100],
},
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

  },
  cardLogin: {
    display: "flex",
    flexDirection: "row",
    // minHeight: "9vh",
    backgroundColor: colors.blueGrey[50],
    borderRadius: "19px",
    padding: "4px",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(8)
  },
  cardLoginColumn: {
    display: "flex",
    flexDirection: "column",
    padding: "15px 0px",
    margin: "40px 65px",
    minWidth: "300px",
    minHeight: "400px",
  },
  cardLoginImg: {
    display: "flex",
    flexDirection: "column",
    // marginLeft: theme.spacing(4)
  },
  cardTituloLogin: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: colors.blueGrey[700],
    // marginLeft: theme.spacing(1),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
    fontFamily: "bold",
    // backgroundColor: "red",
    // margin: "10px 0px",
    width: "100%",
  },

  textBoox: {
    // backgroundColor: "white",
    marginBottom: theme.spacing(2),
    borderRadius: "4px",
    // border: "10px"
    // borderRadius: "14px",

    // margin: "10px 5px",
  },
  imgContainer: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    borderRadius: "4px",
  },
  img: {
    // width: "100px",
    // height: "100px",
    borderRadius: "12px",
  },
  formLogin: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
    justifyItems: "center",
    justifyContent: "center",
  },
  btnLogin: {
    // backgroundColor: "red",
    marginTop: theme.spacing(2),
    borderRadius: "10px",
    backgroundColor: colors.blueGrey[700],
    width: "120px",
    color: "white",
    "&:hover": {
      backgroundColor: colors.blueGrey[900],
    },
  },
  contentTextBox: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",

    width: "300px",
  },

  carrusel: {
    // maxWidth: "350px",
    width: "450px",
    height: "570px",
    borderRadius: "12px",
    // backgroundColor: "red"
  },
  icon: {
    marginTop: theme.spacing(10),
    maxWidth: "100%",
    maxHeight: 300,
    // height: "100px",
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing(5),
  },
  titulo: {
    fontWeight: "bold",
    // fontFamily: theme.typography.fontFamily("")
    // fontWeight: String(theme.typography.fontWeightBold),
  },

  button: {
    marginTop: theme.spacing(2),
    borderRadius: "10px",
    // width: "120px",
    // "&:hover": {
    //   backgroundColor: colors.blueGrey[50],
    // },
  },
}));



const initialValues = Object.freeze({ usuario: '', password: '' });

const validationSchema = yup.object().shape({
  usuario: yup.string().required('Required'),
  password: yup.string().min(5, 'Too short').required('Required')
});


const LoginScreen = () => {

  const router = useRouter();
  const [openErrorLogin, setOpenErrorLogin] = useState<boolean>(false)
  const [messageError, setMessageError] = useState<string>("")
  const setUserInfo = useSetRecoilState(userInfo)


  const onSubmit = useCallback(async ({  usuario, password }, { setSubmitting }) => {
    try {
      // return router.push("home/user");
      console.log("user: ", usuario, "password", password);
      // console.log(login)
      if(isNotNilOrEmpty(usuario) && isNotNilOrEmpty(password)){
      //   const hash =btoa(password)
      // console.log("hash ",hash)
        const data = await login(usuario, password)
        console.log("data: ",data)
        // localStorage.setItem("token.sig",data.token!);
        // setUserInfo(data)
        return router.push(EnlacesSidebar.home.route);
      }

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
      setOpenErrorLogin(true)
      setMessageError(String(err.message))
      // console.log("eerr: ",err.message)
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
      <title>Login</title>
    </Head>
    <Box className={classes.root}>
      <Container className={classes.container}>
      {openErrorLogin &&  <ModalAuth
        openModal={openErrorLogin}
        setOpenModal={setOpenErrorLogin}
        title={"Error login"}
        message={messageError}
        />}
        <Box className={classes.cardLogin}>
          <Box className={classes.cardLoginColumn}>
            <div className={classes.cardTituloLogin}>
              <Typography variant="h5" className={classes.titulo}>
                {" "}
                Login
              </Typography>
            </div>
            <form
              action="#"
              onSubmit={handleSubmit}
              onReset={handleReset}
              noValidate
              className={classes.formLogin}
            >
              <div className={classes.contentTextBox}>
                <TextField
                  className={classes.textBoox}
                  variant="outlined"
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
                  // fullWidth
                />
                <TextField
                  className={classes.textBoox}
                  variant="outlined"
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
                  // fullWidth
                />
              </div>

              <div className={classes.contentButtons}>
                <div></div>
                {/* <Button
                variant="text"
                color="primary"
                className={classes.button}
              >
                {" "}
                Registrarse
              </Button> */}
                <Button
                  type="submit"
                  variant="text"
                  className={classes.btnLogin}
                >
                  {" "}
                  Ingresar
                </Button>
              </div>
            </form>
          </Box>
          <Hidden smDown>
            <Box className={classes.cardLoginImg}>
              <div className={classes.imgContainer}>
                <Carousel
                  showIndicators={true}
                  showStatus={false}
                  showArrows={false}
                  autoPlay={true}
                  infiniteLoop={true}
                  className={classes.carrusel}
                >
                  <div>
                    <Image
                      width={450}
                      height={570}
                      className={classes.img}
                      src={"/img/login/iowa-city.jpg"}
                    />
                  </div>
                  <div>
                    <Image
                      width={450}
                      height={570}
                      className={classes.img}
                      src={"/img/login/los-angeles.webp"}
                    />
                  </div>
                  <div>
                    <Image
                      width={450}
                      height={570}
                      className={classes.img}
                      src={"/img/login/rascacielo.jpg"}
                    />
                  </div>
                </Carousel>
              </div>
            </Box>
          </Hidden>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default LoginScreen;
