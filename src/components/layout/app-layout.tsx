import React from "react";
import SideBar from "./app-sidebar";
import { AppBar, Box, colors, Container, makeStyles } from "@material-ui/core";
import NavBar from "./app-bar";
import clsx from "clsx";

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
const AppLayout: React.FC<IProps> = ({ children, className }) => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <div className={classes.root}>
        <SideBar />
        <Box className={classes.componentRoot}>
          <div className={clsx(classes.containerCard, className)}>
            {children}
          </div>
        </Box>
      </div>
    </>
  );
};

export default AppLayout;
