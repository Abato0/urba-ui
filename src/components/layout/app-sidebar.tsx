import React, { FC, useCallback } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box, colors, Slide } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { showSidebar } from "../../utils/states";
import AcordionHeader from "./sidebar/acordionHeader";
import ItemSidebar from "./sidebar/acordionItemClick";
import {
  faBezierCurve,
  faCar,
  faCarBattery,
  faCarCrash,
  faClipboard,
  faDonate,
  faEdit,
  faFileInvoiceDollar,
  faFileSignature,
  faFolderOpen,
  faGopuram,
  faIdCard,
  faIndustry,
  faKey,
  faListAlt,
  faPalette,
  faRoad,
  faSquare,
  faTools,
  faUser,
  faUsers,
  faUsersCog,
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
      route: "/usuario/ingresar",
    },
    cambioContrasena: {
      route: "/usuario/cambio-password",
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
  vehiculo: {
    registrar: {
      route: "/vehiculo/ingresar",
    },
    listado: {
      route: "/vehiculo/listado",
    },
    activacion: {
      route: "/vehiculo/activacion",
    },
  },

  tag: {
    listado: {
      route: "/tag/listado",
    },
    listadoTag: {
      route: "/tag/listado-tags",
    },
    registrar: {
      route: "/tag/registrar",
    },
    asignacionTag: {
      registrar: { route: "/tag/registrar/asignacion-tag" },
      listado: { route: "/tag/asignacion-listado" },
    },
  },
  mantenimiento: {
    colores: {
      registrar: {
        route: "/mantenimiento/color/registrar",
      },
      listado: {
        route: "/mantenimiento/color/listado",
      },
    },
    calle: {
      registrar: {
        route: "/mantenimiento/calle/registrar",
      },
      listado: {
        route: "/mantenimiento/calle/listado",
      },
    },
    manzana: {
      registrar: {
        route: "/mantenimiento/manzana/registrar",
      },
      listado: {
        route: "/mantenimiento/manzana/listado",
      },
    },
    tipoEdificacion: {
      registrar: {
        route: "/mantenimiento/tipo-edificacion/registrar",
      },
      listado: {
        route: "/mantenimiento/tipo-edificacion/listado",
      },
    },

    marca: {
      registrar: {
        route: "/mantenimiento/marca/registrar",
      },
      listado: {
        route: "/mantenimiento/marca/listado",
      },
    },

    modelo: {
      registrar: {
        route: "/mantenimiento/modelo/registrar",
      },
      listado: {
        route: "/mantenimiento/modelo/listado",
      },
    },
    statusVehiculo: {
      registrar: {
        route: "/mantenimiento/status-vehiculo/registrar",
      },
      listado: {
        route: "/mantenimiento/status-vehiculo/listado",
      },
    },

    valorTag: {
      registrar: {
        route: "/mantenimiento/valor-tag/registrar",
      },
      listado: {
        route: "/mantenimiento/valor-tag/listado",
      },
    },

    parentesco: {
      registrar: {
        route: "/mantenimiento/parentesco/registrar",
      },
      listado: {
        route: "/mantenimiento/parentesco/listado",
      },
    },
    logs: {
      listado: {
        route: "/log/listado",
      },
    },
    tipoIdentificacion: {
      listado: {
        route: "/mantenimiento/tipoIdentificacion/listado",
      },
    },
  },
};
const Sidebar: FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const [openShowSideBar, setOpenShowSideBar] = useRecoilState(showSidebar);


  return (
    <>
      <Slide direction="right" in={openShowSideBar} mountOnEnter unmountOnExit>
        <Box className={classes.root}>
          <AcordionHeader icon={faUser} label={"Usuarios"}>
            <ItemSidebar
              icon={faListAlt}
              eventClick={() =>
                router.push({
                  pathname: String(EnlacesSidebar.usuario.listado.route),
                })
              }
              label={"Registro de Usuarios"}
            />
          </AcordionHeader>

          <AcordionHeader icon={faFolderOpen} label={"Listados"}>
            <AcordionHeader icon={faUsers} label={"Grupos Familiares"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(
                      EnlacesSidebar.grupoFamiliar.listado.route
                    ),
                  })
                }
                label={"Listado de Grupos Familiares"}
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
                label={"Listado de Integrantes Familiares"}
              />
            </AcordionHeader>
            <AcordionHeader icon={faDonate} label={"Pagos"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.pago.listado.route),
                  })
                }
                label={"Listado de Pagos"}
              />
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.tag.listado.route),
                  })
                }
                label={"Listado de Pago por Tag"}
              />
            </AcordionHeader>
            <AcordionHeader icon={faCar} label={"Vehiculos"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.vehiculo.listado.route),
                  })
                }
                label={"Listado de Vehiculos"}
              />
            </AcordionHeader>

            <AcordionHeader icon={faDonate} label={"Tags"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.tag.listadoTag.route),
                  })
                }
                label={"Listado de Tags"}
              />
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.push({
                    pathname: String(
                      EnlacesSidebar.tag.asignacionTag.listado.route
                    ),
                  })
                }
                label={"Listado de asignación de Tag"}
              />
            </AcordionHeader>
          </AcordionHeader>

          <AcordionHeader icon={faTools} label={"Registros"}>
            <AcordionHeader icon={faUsers} label={"Grupos Familiares"}>
              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(
                      EnlacesSidebar.grupoFamiliar.registrar.route
                    ),
                  })
                }
                label={"Registrar grupo familiar"}
              />
            </AcordionHeader>
            <AcordionHeader icon={faUser} label={"Integrantes"}>
              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.integrante.registrar.route),
                  })
                }
                label={"Registrar integrante familiar"}
              />
            </AcordionHeader>
            <AcordionHeader icon={faDonate} label={"Pagos"}>
              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.pago.registrar.route),
                  })
                }
                label={"Registrar pago"}
              />
            </AcordionHeader>
            <AcordionHeader icon={faCar} label={"Vehiculos"}>
              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.vehiculo.registrar.route),
                  })
                }
                label={"Registrar vehiculo"}
              />
            </AcordionHeader>

            <AcordionHeader icon={faDonate} label={"Tags"}>
              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(EnlacesSidebar.tag.registrar.route),
                  })
                }
                label={"Registrar Tag"}
              />

              <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.push({
                    pathname: String(
                      EnlacesSidebar.tag.asignacionTag.registrar.route
                    ),
                  })
                }
                label={"Asignación de Tag"}
              />
            </AcordionHeader>
          </AcordionHeader>

          <AcordionHeader icon={faTools} label={"Mantenimiento"}>
            <AcordionHeader icon={faFileSignature} label={"Logs"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.logs.listado.route
                    ),
                  })
                }
                label={"Listado de Actividades"}
              />
            </AcordionHeader>

            <AcordionHeader icon={faPalette} label={"Colores"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.colores.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.colores.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faRoad} label={"Calle"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.calle.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.calle.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faSquare} label={"Manzana"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.manzana.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.manzana.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faBezierCurve} label={"Marca"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.marca.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.marca.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faCarCrash} label={"Modelo"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.modelo.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.modelo.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faCarBattery} label={"Status Vehiculo"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.statusVehiculo.registrar
                        .route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faFileInvoiceDollar} label={"Valor Tag"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.valorTag.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.valorTag.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>

            <AcordionHeader icon={faUsersCog} label={"Parentesco"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.parentesco.listado.route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.parentesco.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>
            <AcordionHeader icon={faIdCard} label={"Tipo de identificación"}>
              <ItemSidebar
                icon={faListAlt}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.tipoIdentificacion.listado
                        .route
                    ),
                  })
                }
                label={"Listado"}
              />
              {/* <ItemSidebar
                icon={faEdit}
                eventClick={() =>
                  router.replace({
                    pathname: String(
                      EnlacesSidebar.mantenimiento.parentesco.registrar.route
                    ),
                  })
                }
                label={"Registrar"}
              /> */}
            </AcordionHeader>
          </AcordionHeader>
        </Box>
      </Slide>
    </>
  );
};

export default Sidebar;
