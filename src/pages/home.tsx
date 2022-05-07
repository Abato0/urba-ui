import { Container, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import LayoutTituloPagina from '../components/layout/tituloPagina-layout'
import { DashBoardPrueba } from '../components/core/dashboard/dashboardPrueba'
import { DashBoardPagosRealizados } from '../components/core/dashboard/dashboardPagosRealizados'
import { CarruselImagenesLogin } from '../components/login/carruselImagenesLogin'
import { CarruselDashboardHorizontal } from '../components/core/dashboard/CarruselDashboardHorizontal'

const useStyles = makeStyles({
    gridContent: {
        // marginTop: 80,
        marginBottom: 180,
    },
    paperItem: {
        // minWidth: 300,
        // maxWidth: 450,
    },
    cardItem: {
        display: 'flex',
        flexDirection: 'row',
        padding: '30px',
        alignItems: 'center',
    },
    icon: {
        display: 'flex',
        flexDirection: 'column',
        height: 50,
    },
    List: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '25px',
    },
    ListItem: {
        margin: '2px',
        width: '100%',
    },
    imageLogo: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 40,
        padding: 20,
    },
    img: {
        borderRadius: 10,
    },
    containerImage: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "red"
    },
    containerCarrusel: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
})

const ScreenHome = () => {
    const classes = useStyles()
    const router = useRouter()

    const redirect = (enlace: string) => {
        router.push({
            pathname: String(enlace),
        })
    }

    return (
        <LayoutTituloPagina>
            <Container className={classes.gridContent}>
                <div className={classes.containerCarrusel}>
                    <CarruselDashboardHorizontal
                        imagenes={[
                            {
                                url: '/img/urbanizacion.jpg',
                            },
                            {
                                url: '/img/home/logo-home.jpeg',
                            },
                        ]}
                    />
                </div>
                <div className={classes.containerImage}>
                    <DashBoardPagosRealizados />
                </div>
            </Container>
        </LayoutTituloPagina>
    )
}

export default ScreenHome
