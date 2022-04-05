import {
  Button,
  colors,
  Container,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUser,
  faIndustry,
  faDonate,
  faCarAlt,
} from "@fortawesome/free-solid-svg-icons";
import CardItemHome from "../components/core/card/cardItemHome";
import AppLayout from "../components/layout/app-layout";
import Image from "next/image";
import { EnlacesSidebar } from "../components/layout/app-sidebar";
import { useRouter } from "next/router";
import NavBar from "../components/layout/app-bar";

const useStyles = makeStyles({
  gridContent: {
    marginTop: 80,
    marginBottom: 180,
  },
  paperItem: {
    minWidth: 300,
    maxWidth: 450,
  },
  cardItem: {
    display: "flex",
    flexDirection: "row",
    padding: "30px",
    alignItems: "center",
  },
  icon: {
    display: "flex",
    flexDirection: "column",
    height: 50,
  },
  List: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "25px",
  },
  ListItem: {
    margin: "2px",
    width: "100%",
  },
  imageLogo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40,
    padding: 20,
  },
  img: {
    borderRadius: 10,
  },
  containerImage: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const ScreenHome = () => {
  const classes = useStyles();
  const router = useRouter();

  const redirect = (enlace: string) => {
    router.push({
      pathname: String(enlace),
    });
  };

  return (
    <Container className={classes.gridContent}>
      <div className={classes.containerImage}>
        <Paper elevation={4} className={classes.imageLogo}>
          <Image
            alt="logo"
            className={classes.img}
            height={200}
            width={500}
            src={"/img/home/logo-home.jpeg"}
          />
        </Paper>
      </div>
    </Container>
  );
};

ScreenHome.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <NavBar />
      <AppLayout>{page}</AppLayout>;
    </>
  );
};

export default ScreenHome;
