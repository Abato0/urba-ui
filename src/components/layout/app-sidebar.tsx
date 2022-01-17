import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { FC } from "react";
import { Box, createStyles, colors, Fade, Slide } from "@material-ui/core";
import { minHeight, borderRadius } from "@mui/system";
import { useRouter } from "next/router";
import { isEmpty } from "ramda";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { showSidebar } from "../../utils/states";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      minHeight: "100vh",
      // marginTop: theme.spacing(2)
    },
    sidebar: {
      flexDirection: "column",
      backgroundColor: colors.blueGrey[900],
      // backgroundColor: "black",
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(6),
      color: "white",
      // minWidth: "200px"
    },

    nodePadre: {
      padding: "10px",
      "&:hover": {
        backgroundColor: colors.blueGrey[700],
        borderRadius: "7px",
      },
    },
    nodeHijo: {
      padding: "5px",
      "&:hover": {
        backgroundColor: colors.blueGrey[400],
        borderRadius: "7px",
      },
    },
    box: {
      flexDirection: "column",
      width: "100%",
      minWidth: "700px",
      borderRadius: "30px",
      margin: "10px",
      background: colors.blueGrey[50],
    },
    children: {
      display: "flex",
      flexDirection: "column",
      margin: "10px",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

export const EnlacesSidebar = {
  home: {
    route: "/grupo-familiar",
  },
  grupoFamiliar: {
    registrar: {
      route: "/grupo-familiar/registrar",
    },
    listado: {
      route: "/grupo-familiar/listado",
    },
  },
  integrante: {
    registrar: {
      route: "/integrante/ingresar",
    },
    listado: {
      route: "/integrante/listado",
    },
  },

  usuario: {
    listado: {
      route: "/user/listado",
    },
  },
  pago: {
    registrar: {
      route: "/pago/ingresar",
    },
    listado: {
      route: "/pago/listado",
    },
  },
  aporte: {
    registrar: {
      route: "/aporte/ingresar",
    },
    listado: {
      route: "/aporte/listado",
    },
  },
};
const Sidebar: FC = ({ children }) => {
  const classes = useStyles();
  const router = useRouter();
  const ShowSidebar = useRecoilValue(showSidebar);

  console.log("showSidebar: ", ShowSidebar);

  return (
    <div className={classes.root}>
      <Slide direction="right" in={ShowSidebar}>
        <TreeView
          className={classes.sidebar}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem nodeId="1" label="Familias" className={classes.nodePadre}>
            <TreeItem nodeId="4" label="Grupo Familiar">
              <Link href={EnlacesSidebar.grupoFamiliar.registrar.route}>
                <TreeItem
                  nodeId="8"
                  label="Registrar Grupo Familiar"
                  className={classes.nodeHijo}
                />
              </Link>
              <Link href={EnlacesSidebar.grupoFamiliar.listado.route}>
                <TreeItem
                  nodeId="9"
                  label="Listado"
                  className={classes.nodeHijo}
                />
              </Link>
            </TreeItem>
            <TreeItem nodeId="5" label="Integrante">
              <Link href={EnlacesSidebar.integrante.registrar.route}>
                <TreeItem
                  nodeId="10"
                  label="Registrar Integrante"
                  className={classes.nodeHijo}
                />
              </Link>
              <Link href={EnlacesSidebar.integrante.listado.route}>
                <TreeItem
                  nodeId="11"
                  label="Listado Integrante"
                  className={classes.nodeHijo}
                />
              </Link>
            </TreeItem>
          </TreeItem>
          <TreeItem nodeId="2" label="Pago" className={classes.nodePadre}>
            <Link href={EnlacesSidebar.pago.registrar.route}>
              <TreeItem
                nodeId="6"
                label="Ingresar Pago"
                className={classes.nodeHijo}
              />
            </Link>
            <Link href={EnlacesSidebar.pago.listado.route}>
              <TreeItem
                nodeId="7"
                label="Listado de Pagos"
                className={classes.nodeHijo}
              />
            </Link>

            {/* <TreeItem nodeId="6" label="Material-UI">
          <TreeItem nodeId="7" label="src">
            <TreeItem nodeId="8" label="index.js" />
            <TreeItem nodeId="9" label="tree-view.js" />
          </TreeItem>
        </TreeItem> */}
          </TreeItem>
          <TreeItem nodeId="3" label="Aporte" className={classes.nodePadre}>
            <Link href={EnlacesSidebar.aporte.registrar.route}>
              <TreeItem
                nodeId="12"
                label="Ingresar Aportacion"
                className={classes.nodeHijo}
              />
            </Link>
            <Link href={EnlacesSidebar.aporte.listado.route}>
              <TreeItem
                nodeId="13"
                label="Listado de Aportaciones"
                className={classes.nodeHijo}
              />
            </Link>

            {/* <TreeItem nodeId="6" label="Material-UI">
          <TreeItem nodeId="7" label="src">
            <TreeItem nodeId="8" label="index.js" />
            <TreeItem nodeId="9" label="tree-view.js" />
          </TreeItem>
        </TreeItem> */}
          </TreeItem>
        </TreeView>
      </Slide>
      <Box className={classes.box}>
        <div className={classes.children}>{children}</div>
      </Box>
    </div>
  );
};

export default Sidebar;
