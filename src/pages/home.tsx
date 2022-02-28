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
    <>
      <AppLayout>
        <Container className={classes.gridContent}>
          <div className={classes.containerImage}>
            <Paper elevation={4} className={classes.imageLogo}>
              <Image
                className={classes.img}
                height={200}
                width={500}
                src={"/img/home/logo-home.jpeg"}
              />
            </Paper>
          </div>

          <Grid
            container
            spacing={2}
            // direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {/* <Grid    className={classes.imageLogo} item xs={12}> */}

            {/* </Grid> */}
            <Grid item xs={12} sm={6} className={classes.paperItem}>
              <CardItemHome
                onclickIngreso={() =>
                  redirect(EnlacesSidebar.grupoFamiliar.registrar.route)
                }
                onclickListado={() =>
                  redirect(EnlacesSidebar.grupoFamiliar.listado.route)
                }
                icon={faUsers}
                titulo="Grupo Familiares"
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.paperItem}>
              <CardItemHome
                onclickIngreso={() =>
                  redirect(EnlacesSidebar.integrante.registrar.route)
                }
                onclickListado={() =>
                  redirect(EnlacesSidebar.integrante.listado.route)
                }
                icon={faUser}
                titulo="Integrante Familiar"
              />
            </Grid>
            {/* <Grid item xs={12} sm={6} className={classes.paperItem}>
              <CardItemHome
                onclickIngreso={() =>
                  redirect(EnlacesSidebar.aporte.registrar.route)
                }
                onclickListado={() =>
                  redirect(EnlacesSidebar.aporte.listado.route)
                }
                icon={faIndustry}
                titulo="Aportes"
              />
            </Grid> */}
            <Grid item xs={12} sm={6} className={classes.paperItem}>
              <CardItemHome
                onclickIngreso={() =>
                  redirect(EnlacesSidebar.pago.registrar.route)
                }
                onclickListado={() =>
                  redirect(EnlacesSidebar.pago.listado.route)
                }
                icon={faDonate}
                titulo="Pagos"
              />
            </Grid>

            <Grid item xs={12} sm={6} className={classes.paperItem}>
              <CardItemHome
                onclickIngreso={() =>
                  redirect(EnlacesSidebar.pago.registrar.route)
                }
                onclickListado={() =>
                  redirect(EnlacesSidebar.pago.listado.route)
                }
                icon={faCarAlt}
                titulo="Vehiculos"
              />
            </Grid>
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
};

export default ScreenHome;
