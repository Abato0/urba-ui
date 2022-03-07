import React, { useEffect, useState } from "react";
import SideBar from "./app-sidebar";
import {
  AppBar,
  Box,
  colors,
  Container,
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import NavBar from "./app-bar";
import clsx from "clsx";
import { authMe } from "../../auth/auth-service";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    minWidth: 1000,
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
});

interface IProps {
  className?: string;
}
const AppLayoutLogin: React.FC<IProps> = ({ children }) => {
  const classes = useStyles();
  const router = useRouter();
  const [authFlag, setAuthFlag] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const autho = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        setLoading(true);
        const result = await authMe(token);
        if (result && result.code === 200) {
          setAuthFlag(true);
          await redirectLogin();
        }
        setLoading(false);
      } else {
        setAuthFlag(false);
      }
      console.log("token: ", token);
    } catch (error) {
      setAuthFlag(false);
      setLoading(false);
      //   await redirectLogin();
      console.log("error: ", (error as Error).message);
    }
  };

  const redirectLogin = async () => {
    return await router.push("/home");
  };

  useEffect(() => {
    autho();
  }, []);
  return (
    <>
      {!loading && !authFlag ? (
        <>{children}</>
      ) : !loading && authFlag === undefined ? (
        <>
          <LinearProgress />
        </>
      ) : null}
    </>
  );
};

export default AppLayoutLogin;
