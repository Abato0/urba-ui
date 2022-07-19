import React, { FC, useCallback } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box, colors, Slide } from '@material-ui/core'
import { useRecoilState } from 'recoil'

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
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { showSidebar } from '../../../utils/states'
import AcordionHeader from './acordionHeader'
import ItemSidebar from './acordionItemClick'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            flexGrow: 1,
            padding: '6px',
            backgroundColor: 'white',
            minWidth: '300px',
            maxWidth: '350px',
            // marginTop: 30,
            overflow: 'auto',
        },
        nodoPadre: {
            margin: '5px',
        },
        nodoHijo: {
            margin: '4px 0px',
        },
        slider: {
            maxWidth: 200,
        },
    })
)

export const EnlacesSidebar = {
    home: {
        route: '/home',
    },
    grupoFamiliar: {
        registrar: {
            route: '/grupo-familiar/registrar',
        },
        listado: {
            route: '/grupo-familiar/listado',
        },
    },
    integrante: {
        registrar: {
            route: '/integrante/ingresar',
        },
        listado: {
            route: '/integrante/listado',
        },
    },

    usuario: {
        listado: {
            route: '/usuario/ingresar',
        },
        cambioContrasena: {
            route: '/usuario/cambio-password',
        },
    },
    pago: {
        registrar: {
            route: '/pago/ingresar',
        },
        listado: {
            route: '/pago/listado',
        },
        carteraVencida: {
            route: '/pago/cartera-vencida',
        },
        matrizOperaciones: {
            route: '/pago/matriz-operaciones',
        },
    },
    aporte: {
        registrar: {
            route: '/aporte/ingresar',
        },
        listado: {
            route: '/aporte/listado',
        },
    },
    vehiculo: {
        registrar: {
            route: '/vehiculo/ingresar',
        },
        listado: {
            route: '/vehiculo/listado',
        },
        activacion: {
            route: '/vehiculo/activacion',
        },
    },

    tag: {
        listado: {
            route: '/tag/listado',
        },
        listadoTag: {
            route: '/tag/listado-tags',
        },
        registrar: {
            route: '/tag/registrar',
        },
        asignacionTag: {
            registrar: { route: '/tag/registrar/asignacion-tag' },
            listado: { route: '/tag/asignacion-listado' },
        },
    },
    mantenimiento: {
        colores: {
            registrar: {
                route: '/mantenimiento/color/registrar',
            },
            listado: {
                route: '/mantenimiento/color/listado',
            },
        },
        calle: {
            registrar: {
                route: '/mantenimiento/calle/registrar',
            },
            listado: {
                route: '/mantenimiento/calle/listado',
            },
        },
        manzana: {
            registrar: {
                route: '/mantenimiento/manzana/registrar',
            },
            listado: {
                route: '/mantenimiento/manzana/listado',
            },
        },
        tipoEdificacion: {
            registrar: {
                route: '/mantenimiento/tipo-edificacion/registrar',
            },
            listado: {
                route: '/mantenimiento/tipo-edificacion/listado',
            },
        },

        marca: {
            registrar: {
                route: '/mantenimiento/marca/registrar',
            },
            listado: {
                route: '/mantenimiento/marca/listado',
            },
        },

        modelo: {
            registrar: {
                route: '/mantenimiento/modelo/registrar',
            },
            listado: {
                route: '/mantenimiento/modelo/listado',
            },
        },
        statusVehiculo: {
            registrar: {
                route: '/mantenimiento/status-vehiculo/registrar',
            },
            listado: {
                route: '/mantenimiento/status-vehiculo/listado',
            },
        },

        valorTag: {
            registrar: {
                route: '/mantenimiento/valor-tag/registrar',
            },
            listado: {
                route: '/mantenimiento/valor-tag/listado',
            },
        },

        parentesco: {
            registrar: {
                route: '/mantenimiento/parentesco/registrar',
            },
            listado: {
                route: '/mantenimiento/parentesco/listado',
            },
        },
        logs: {
            listado: {
                route: '/log/listado',
            },
        },
        tipoIdentificacion: {
            listado: {
                route: '/mantenimiento/tipoIdentificacion/listado',
            },
        },
        modeloMail: {
            listado: {
                route: '/mantenimiento/modelo-mail/listado',
            },
        },
    },
}

const SidebarMorador: FC = () => {
    const classes = useStyles()
    const router = useRouter()

    const [openShowSideBar, setOpenShowSideBar] = useRecoilState(showSidebar)

    return (
        <>
            <Slide
                direction="right"
                in={openShowSideBar ?? false}
                mountOnEnter
                unmountOnExit
            >
                <Box className={classes.root}>
                    <AcordionHeader icon={faFolderOpen} label={'Listados'}>
                        <AcordionHeader icon={faUser} label={'Integrantes'}>
                            <ItemSidebar
                                icon={faListAlt}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.integrante.listado
                                                .route
                                        ),
                                    })
                                }
                                label={'Listado de Integrantes Familiares'}
                            />
                        </AcordionHeader>
                        <AcordionHeader icon={faDonate} label={'Aportaciones'}>
                            <ItemSidebar
                                icon={faListAlt}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.pago.listado.route
                                        ),
                                    })
                                }
                                label={'Listado de Aportaciones'}
                            />
                            <ItemSidebar
                                icon={faListAlt}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.pago.carteraVencida
                                                .route
                                        ),
                                    })
                                }
                                label={'Cartera Vencida'}
                            />
                            <ItemSidebar
                                icon={faListAlt}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.pago
                                                .matrizOperaciones.route
                                        ),
                                    })
                                }
                                label={'Matriz de Operaciones'}
                            />
                        </AcordionHeader>
                        <AcordionHeader icon={faCar} label={'Vehiculos'}>
                            <ItemSidebar
                                icon={faListAlt}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.vehiculo.listado
                                                .route
                                        ),
                                    })
                                }
                                label={'Listado de Vehiculos'}
                            />
                        </AcordionHeader>
                    </AcordionHeader>

                    <AcordionHeader icon={faTools} label={'Registros'}>
                        <AcordionHeader
                            icon={faUsers}
                            label={'Grupos Familiares'}
                        >
                            <ItemSidebar
                                icon={faEdit}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.grupoFamiliar
                                                .registrar.route
                                        ),
                                    })
                                }
                                label={'Registrar grupo familiar'}
                            />
                        </AcordionHeader>
                        <AcordionHeader icon={faUser} label={'Integrantes'}>
                            <ItemSidebar
                                icon={faEdit}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.integrante.registrar
                                                .route
                                        ),
                                    })
                                }
                                label={'Registrar integrante familiar'}
                            />
                        </AcordionHeader>
                        <AcordionHeader icon={faDonate} label={'Aportaciones'}>
                            <ItemSidebar
                                icon={faEdit}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.pago.registrar.route
                                        ),
                                    })
                                }
                                label={'Registrar Aportación'}
                            />
                        </AcordionHeader>
                        <AcordionHeader icon={faCar} label={'Vehiculos'}>
                            <ItemSidebar
                                icon={faEdit}
                                eventClick={() =>
                                    router.push({
                                        pathname: String(
                                            EnlacesSidebar.vehiculo.registrar
                                                .route
                                        ),
                                    })
                                }
                                label={'Registrar vehiculo'}
                            />
                        </AcordionHeader>
                    </AcordionHeader>
                </Box>
            </Slide>
        </>
    )
}

export default SidebarMorador
