/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box, Slide, Modal } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { showSidebar } from '../../utils/states'
import AcordionHeader from './sidebar/acordionHeader'
import ItemSidebar from './sidebar/acordionItemClick'
import {
    faFolderOpen,
    faTools,
    faUser,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { isNotEmpty, isNotNil } from '../../utils/is-nil-empty'
import Image from 'next/image'
import { COLOR_PRIMARIO } from '../../utils/keys'
import Cookies from 'js-cookie'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            //height: '100%',
            width: theme.spacing(30),
            height: "100%",
            backgroundColor: "white",
            //paddingTop: theme.spacing(6)
            // maxHeight: '100vh',
            // flexGrow: 1,
            //padding: '6px',
            // background: "linear-gradient(to bootom, #b993d6, #8ca6db)",
            // minWidth: '300px',
            // maxWidth: '350px',
            // marginTop: 30,
            //   overflow: 'auto',
            // borderTop: "10px solid"
            // backgroundColor: "red"
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
        logoContainer: {
            backgroundColor: COLOR_PRIMARIO,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            // marginBottom: theme.spacing(2)
        }
    })
)

export interface IItemsSidebar {
    label: string
    icon: IconDefinition
    ruta: string
}

export interface IHeaderSidebar {
    icon: IconDefinition
    label: string
    items: IItemsSidebar[]
}

interface IProps {
    ItemsUsuario: IItemsSidebar[]
    ItemsListado: IHeaderSidebar[]
    ItemsRegistros: IHeaderSidebar[]
    ItemsMantenimiento: IHeaderSidebar[]
    ItemsOperaciones: IItemsSidebar[]
}

const Sidebar: FC<IProps> = ({
    ItemsListado,
    ItemsMantenimiento,
    ItemsRegistros,
    ItemsUsuario,
    ItemsOperaciones
}) => {
    const classes = useStyles()
    const router = useRouter()

    const [openShowSideBar, setOpenShoSidebar] = useRecoilState(showSidebar)

    const [selectedListadoHeader, setSelectedListadoHeader] = useState(false)
    const [selectedRegistroHeader, setSelectedRegistroHeader] = useState(false)
    const [selectedMantenimientoHeader, setSelectedManteniminetoHeader] =
        useState(false)


    const cerrarSession = useCallback(() => {
        Cookies.remove('token')
        return router.push('/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Modal
            // direction="right"
            open={openShowSideBar}
            onClose={() => setOpenShoSidebar(false)}
            style={{
                // overflow: "scroll",
                display: "flex",
                // minHeight: "100px"

            }}

        // mountOnEnter
        // unmountOnExit
        //   style={{ backgroundColor: "red" }}
        >
            <Box className={classes.root} style={{ overflow: "scroll" }}>
                <div className={classes.logoContainer}>
                    <img
                        src="/logo-28.svg"
                        alt="logo"
                        height={70}
                        width={210}
                    // sizes="10vw"
                    //  layout="responsive"

                    //   className={classes.imageLogo}
                    />
                </div>
                {/* {isNotEmpty(ItemsUsuario) && (
                    <AcordionHeader
                        icon={faUser}
                        label={'Usuarios'}
                        selected={isNotNil(
                            ItemsUsuario.find(
                                ({ ruta }) => ruta === router.pathname
                            )
                        )}
                    >
                        {ItemsUsuario.map((item, index) => {
                            return (
                                <ItemSidebar
                                    key={index}
                                    icon={item.icon}
                                    eventClick={() =>
                                        router.push({
                                            pathname: item.ruta,
                                        })
                                    }
                                    label={item.label}
                                    selected={router.pathname === item.ruta}
                                />
                            )
                        })}
                    </AcordionHeader>
                )} */}

                {isNotEmpty(ItemsOperaciones) && <AcordionHeader
                    icon={faUser}
                    label={'Operaciones'}
                    selected={isNotNil(
                        ItemsUsuario.find(
                            ({ ruta }) => ruta === router.pathname
                        )
                    )}
                >
                    {ItemsOperaciones.map((item, index) => {
                        return (
                            <ItemSidebar
                                key={index}
                                icon={item.icon}
                                eventClick={() =>
                                    router.push({
                                        pathname: item.ruta,
                                    })
                                }
                                label={item.label}
                                selected={router.pathname === item.ruta}
                            />
                        )
                    })}
                </AcordionHeader>}

                {isNotEmpty(ItemsListado) && (
                    <AcordionHeader
                        selected={selectedListadoHeader}
                        icon={faFolderOpen}
                        label={'Listados'}
                        elevation={1}
                    >
                        {ItemsListado.map((itemHeader, indexHeader) => {
                            return (
                                <AcordionHeader
                                    key={indexHeader}
                                    icon={itemHeader.icon}
                                    label={itemHeader.label}
                                    selected={isNotNil(
                                        itemHeader.items.find(
                                            ({ ruta }) =>
                                                ruta === router.pathname
                                        )
                                    )}
                                >
                                    {itemHeader.items.map((item, index) => {
                                        return (
                                            <ItemSidebar
                                                key={index}
                                                icon={item.icon}
                                                eventClick={() => {
                                                    setSelectedListadoHeader(
                                                        true
                                                    )
                                                    setSelectedManteniminetoHeader(
                                                        false
                                                    )
                                                    setSelectedRegistroHeader(
                                                        false
                                                    )
                                                    router.push({
                                                        pathname: item.ruta,
                                                    })
                                                }}
                                                label={item.label}
                                                selected={
                                                    router.pathname ===
                                                    item.ruta
                                                }
                                            />
                                        )
                                    })}
                                </AcordionHeader>
                            )
                        })}
                    </AcordionHeader>
                )}

                {isNotEmpty(ItemsRegistros) && (
                    <AcordionHeader
                        selected={selectedRegistroHeader}
                        icon={faTools}
                        label={'Registros'}
                    >
                        {ItemsRegistros.map((itemHeader, indexHeader) => {
                            return (
                                <AcordionHeader
                                    key={indexHeader}
                                    elevation={1}
                                    icon={itemHeader.icon}
                                    label={itemHeader.label}
                                    selected={isNotNil(
                                        itemHeader.items.find(
                                            ({ ruta }) =>
                                                ruta === router.pathname
                                        )
                                    )}
                                >
                                    {itemHeader.items.map((item, index) => {
                                        return (
                                            <ItemSidebar
                                                key={index}
                                                icon={item.icon}
                                                eventClick={() => {
                                                    setSelectedListadoHeader(
                                                        false
                                                    )
                                                    setSelectedManteniminetoHeader(
                                                        false
                                                    )
                                                    setSelectedRegistroHeader(
                                                        true
                                                    )
                                                    router.push({
                                                        pathname: item.ruta,
                                                    })
                                                }}
                                                label={item.label}
                                                selected={
                                                    router.pathname ===
                                                    item.ruta
                                                }
                                            />
                                        )
                                    })}
                                </AcordionHeader>
                            )
                        })}
                    </AcordionHeader>
                )}
                {isNotEmpty(ItemsMantenimiento) && (
                    <AcordionHeader
                        selected={selectedMantenimientoHeader}
                        icon={faTools}
                        label={'Parametrización'}
                    >
                        {ItemsMantenimiento.map((itemHeader, indexHeader) => {
                            return (
                                <AcordionHeader
                                    elevation={1}
                                    key={indexHeader}
                                    icon={itemHeader.icon}
                                    label={itemHeader.label}
                                    selected={isNotNil(
                                        itemHeader.items.find(
                                            ({ ruta }) =>
                                                ruta === router.pathname
                                        )
                                    )}
                                >
                                    {itemHeader.items.map((item, index) => {
                                        return (
                                            <ItemSidebar
                                                key={index}
                                                icon={item.icon}
                                                eventClick={() => {
                                                    setSelectedListadoHeader(
                                                        false
                                                    )
                                                    setSelectedManteniminetoHeader(
                                                        true
                                                    )
                                                    setSelectedRegistroHeader(
                                                        false
                                                    )
                                                    router.push({
                                                        pathname: item.ruta,
                                                    })
                                                }}
                                                label={item.label}
                                                selected={
                                                    router.pathname ===
                                                    item.ruta
                                                }
                                            />
                                        )
                                    })}
                                </AcordionHeader>
                            )
                        })}
                    </AcordionHeader>
                )}
                <div style={{ marginTop: "10px", padding: "5px", backgroundColor: "white" }}>
                    <ItemSidebar
                        eventClick={cerrarSession}
                        label={"Cerrar Sesion"}
                        selected={false}
                    />
                </div>

            </Box>
        </Modal>
    )
}

export default Sidebar
