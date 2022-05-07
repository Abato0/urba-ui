import { FC, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Box, Slide } from '@material-ui/core'
import { useRecoilValue } from 'recoil'
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '120vh',
            // flexGrow: 1,
            padding: '6px',
            // background: "linear-gradient(to bootom, #b993d6, #8ca6db)",
            minWidth: '300px',
            maxWidth: '350px',
            // marginTop: 30,
            overflow: 'auto',
            // borderTop: "10px solid"
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
}

const Sidebar: FC<IProps> = ({
    ItemsListado,
    ItemsMantenimiento,
    ItemsRegistros,
    ItemsUsuario,
}) => {
    const classes = useStyles()
    const router = useRouter()

    const openShowSideBar = useRecoilValue(showSidebar)

    const [selectedListadoHeader, setSelectedListadoHeader] = useState(false)
    const [selectedRegistroHeader, setSelectedRegistroHeader] = useState(false)
    const [selectedMantenimientoHeader, setSelectedManteniminetoHeader] =
        useState(false)

    return (
        <Slide
            direction="right"
            in={openShowSideBar}
            mountOnEnter
            unmountOnExit
        >
            <Box className={classes.root}>
                {isNotEmpty(ItemsUsuario) && (
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
                )}

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
                        label={'Mantenimiento'}
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
            </Box>
        </Slide>
    )
}

export default Sidebar
