import React, { useEffect, useState } from "react";
import SideBar from "./app-sidebar";
import {
  AppBar,
  Box,
  colors,
  Container,
  createStyles,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import NavBar from "./app-bar";
import clsx from "clsx";
import { authMe } from "../../auth/auth-service";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { TipoUsuario } from "../core/input/dateSelect";
import { equals } from "ramda";
import SidebarMorador from "./sidebar/app-sidebar-morador";
import { useSetRecoilState } from "recoil";
import { userInfo } from "../../utils/states";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      minWidth: 1000,
      height: "100%",
    },
    componentRoot: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: 700,
      // minHeight:"100%",
      minWidth: "400px",
      background: "linear-gradient(to right, #e0eafc, #cfdef3)",
      borderRadius: "10px",
      alignContent: "center",
      alignItems: "center",
      margin: 10,
    },
    containerCard: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      margin: "20px",
      width: "100%",
      borderRadius: "10px",
    },
    cardTitle: {
      backgroundColor: "white",
      width: "100%",
      paddingBottom: theme.spacing(3),
    },
    containerTitle: {
      // backgroundColor: "red",
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    title: {
      fontSize: theme.typography.pxToRem(19),
      backgroundColor: colors.grey[200],
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 5,
      // fontWeight: "bold",
      // font
    },
  })
);

interface IProps {
  className?: string;
  titulo?: string;
}
const AppLayout: React.FC<IProps> = ({ children, className, titulo }) => {
  const classes = useStyles();
  const router = useRouter();
  const [authFlag, setAuthFlag] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tipoUsuario, setTipoUsuario] = useState("");

  const setUsuarioState = useSetRecoilState(userInfo);

  const autho = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        setLoading(true);
        const result = await authMe(token);

        console.log("tipoUsuario", result);
        if (result && result.code === 200) {
          setAuthFlag(true);
          setTipoUsuario(result.data.tipo);
          setUsuarioState({
            tipo_usuario: result.data.tipo,
            user: result.data.usuario,
          });
        }
        setLoading(false);
      } else {
        setAuthFlag(false);
        await redirectLogin();
      }
      console.log("token: ", token);
    } catch (error) {
      setAuthFlag(false);
      setLoading(false);
      await redirectLogin();
      console.log("error: ", (error as Error).message);
    }
  };

  const redirectLogin = async () => {
    return await router.push("/login");
  };

  useEffect(() => {
    autho();
  }, []);
  return (
    <>
      {!loading && authFlag && equals(tipoUsuario, TipoUsuario.ADMIN) ? (
        <>
          {/* <NavBar /> */}
          <div className={classes.root}>
          

            <SideBar />
            <Box className={classes.componentRoot}>
              {titulo && (
                <div className={classes.cardTitle}>
                  <div className={classes.containerTitle}>
                    <Typography variant="overline" className={classes.title}>
                      {titulo}
                    </Typography>
                  </div>
                </div>
              )}
              <div className={clsx(classes.containerCard, className)}>
                {children}
              </div>
            </Box>
          </div>
        </>
      ) : !loading && authFlag && equals(tipoUsuario, TipoUsuario.MORADOR) ? (
        <>
          {/* <NavBar /> */}
          <div className={classes.root}>
            <SidebarMorador />
            <Box className={classes.componentRoot}>
              <div className={clsx(classes.containerCard, className)}>
                {children}
              </div>
            </Box>
          </div>
        </>
      ) : !loading && authFlag === undefined ? (
        <>
          <LinearProgress />
        </>
      ) : null}
    </>
  );
};

export default AppLayout;
