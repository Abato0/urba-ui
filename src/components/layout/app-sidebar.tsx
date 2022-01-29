import React, { FC, useCallback } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box, colors, Slide } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { showSidebar } from "../../utils/states";
import AcordionHeader from "./sidebar/acordionHeader";
import ItemSidebar from "./sidebar/acordionItemClick";
import {
  faDonate,
  faEdit,
  faIndustry,
  faListAlt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      flexGrow: 1,
      padding: "6px",
      backgroundColor: "white",
      minWidth: "300px",
      maxWidth: "350px",
      marginTop: 30,
      overflow: "auto",
    },
    nodoPadre: {
      margin: "5px",
    },
    nodoHijo: {
      margin: "4px 0px",
    },
    slider: {
      maxWidth: 200,
    },
  })
);

export const EnlacesSidebar = {
  home: {
    route: "/home",
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
const Sidebar: FC = () => {
  // const classes = useStyles();
  // const router = useRouter();
  // const ShowSidebar = useRecoilValue(showSidebar);

  // console.log("showSidebar: ", ShowSidebar);

  // return (
  //   <div className={classes.root}>
  //     <Slide direction="right" in={ShowSidebar}>
  //       <TreeView
  //         className={classes.sidebar}
  //         defaultCollapseIcon={<ExpandMoreIcon />}
  //         defaultExpandIcon={<ChevronRightIcon />}
  //       >
  //         <TreeItem nodeId="1" label="Familias" className={classes.nodePadre}>
  //           <TreeItem nodeId="4" label="Grupo Familiar">
  //             <Link href={EnlacesSidebar.grupoFamiliar.registrar.route}>
  //               <TreeItem
  //                 nodeId="8"
  //                 label="Registrar Grupo Familiar"
  //                 className={classes.nodeHijo}
  //               />
  //             </Link>
  //             <Link href={EnlacesSidebar.grupoFamiliar.listado.route}>
  //               <TreeItem
  //                 nodeId="9"
  //                 label="Listado"
  //                 className={classes.nodeHijo}
  //               />
  //             </Link>
  //           </TreeItem>
  //           <TreeItem nodeId="5" label="Integrante">
  //             <Link href={EnlacesSidebar.integrante.registrar.route}>
  //               <TreeItem
  //                 nodeId="10"
  //                 label="Registrar Integrante"
  //                 className={classes.nodeHijo}
  //               />
  //             </Link>
  //             <Link href={EnlacesSidebar.integrante.listado.route}>
  //               <TreeItem
  //                 nodeId="11"
  //                 label="Listado Integrante"
  //                 className={classes.nodeHijo}
  //               />
  //             </Link>
  //           </TreeItem>
  //         </TreeItem>
  //         <TreeItem nodeId="2" label="Pago" className={classes.nodePadre}>
  //           <Link href={EnlacesSidebar.pago.registrar.route}>
  //             <TreeItem
  //               nodeId="6"
  //               label="Ingresar Pago"
  //               className={classes.nodeHijo}
  //             />
  //           </Link>
  //           <Link href={EnlacesSidebar.pago.listado.route}>
  //             <TreeItem
  //               nodeId="7"
  //               label="Listado de Pagos"
  //               className={classes.nodeHijo}
  //             />
  //           </Link>

  //         </TreeItem>
  //         <TreeItem nodeId="3" label="Aporte" className={classes.nodePadre}>
  //           <Link href={EnlacesSidebar.aporte.registrar.route}>
  //             <TreeItem
  //               nodeId="12"
  //               label="Ingresar Aportacion"
  //               className={classes.nodeHijo}
  //             />
  //           </Link>
  //           <Link href={EnlacesSidebar.aporte.listado.route}>
  //             <TreeItem
  //               nodeId="13"
  //               label="Listado de Aportaciones"
  //               className={classes.nodeHijo}
  //             />
  //           </Link>

  //         </TreeItem>
  //       </TreeView>
  //     </Slide>
  //     <Box className={classes.box}>
  //       <div className={classes.children}>{children}</div>
  //     </Box>
  //   </div>
  // );
  const classes = useStyles();
  const router = useRouter();

  const [openShowSideBar, setOpenShowSideBar] = useRecoilState(showSidebar);

  const onClick = useCallback(() => {}, []);
  return (
    <>
      <Slide direction="right" in={openShowSideBar} mountOnEnter unmountOnExit>
        <Box className={classes.root}>
          <AcordionHeader icon={faUsers} label={"Grupo Familiar"}>
            <ItemSidebar
              icon={faListAlt}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.grupoFamiliar.listado.route),
                })
              }
              label={"Listado"}
            />
            <ItemSidebar
              icon={faEdit}
              eventClick={() =>
                router.push({
                  pathname: String(
                    EnlacesSidebar.grupoFamiliar.registrar.route
                  ),
                })
              }
              label={"Ingresar"}
            />
          </AcordionHeader>
          <AcordionHeader icon={faUser} label={"Integrantes"}>
            <ItemSidebar
              icon={faListAlt}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.integrante.listado.route),
                })
              }
              label={"Listado"}
            />
            <ItemSidebar
              icon={faEdit}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.integrante.registrar.route),
                })
              }
              label={"Registrar"}
            />
          </AcordionHeader>
          <AcordionHeader icon={faIndustry} label={"Aporte"}>
            <ItemSidebar
              icon={faListAlt}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.aporte.listado.route),
                })
              }
              label={"Listado"}
            />
            <ItemSidebar
              icon={faEdit}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.aporte.registrar.route),
                })
              }
              label={"Registrar"}
            />
          </AcordionHeader>
          <AcordionHeader icon={faDonate} label={"Pago"}>
            <ItemSidebar
              icon={faListAlt}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.pago.listado.route),
                })
              }
              label={"Listado"}
            />
            <ItemSidebar
              icon={faEdit}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.pago.registrar.route),
                })
              }
              label={"Registrar"}
            />
          </AcordionHeader>
        </Box>
      </Slide>
    </>
  );
};

export default Sidebar;
