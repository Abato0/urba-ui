import { Container, makeStyles, Paper } from '@material-ui/core'
import React, { useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import LayoutTituloPagina from '../components/layout/tituloPagina-layout'
import { DashBoardPrueba } from '../components/core/dashboard/dashboardPrueba'
import { DashBoardPagosRealizados } from '../components/core/dashboard/dashboardPagosRealizados'
import { CarruselImagenesLogin } from '../components/login/carruselImagenesLogin'
import { CarruselDashboardHorizontal } from '../components/core/dashboard/CarruselDashboardHorizontal'
import { useListadoImagenesBienvenidaQuery } from '../components/imagenes-de-bienvenida/use-imagenes-bienvenida'
import { LUGAR_IMAGEN } from '../utils/keys'

const useStyles = makeStyles({
    gridContent: {
        // marginTop: 80,
        // marginBottom: 180,
        // backgroundColor: "red",
        height: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column"

    },

    containerImage: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',

    },
    containerCarrusel: {
        display: 'flex',
        // backgroundColor: "red",
        width: '100%',
        height: "40%",

        //      alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
        // margin: 20,
    },
    containerBody: {
        display: "flex",
        height: "60%",
        // backgroundColor: "red",
        flexDirection: "row",
        width: '100%',

    }
})

const ScreenHome = () => {
    const classes = useStyles()
    const router = useRouter()

    const { data, loading } = useListadoImagenesBienvenidaQuery();
    const uriImagenes = useMemo(() => {
        if (!loading && data) {
            return data.ListaImagenesSitio.filter(({ lugar }) => LUGAR_IMAGEN.HOME == lugar).map(({ urlImagen }) => {
                return {
                    url: urlImagen
                }
            })
        }
    }, [data, loading])


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
                        imagenes={
                            uriImagenes ?? []
                            //     [
                            //     {
                            //         url: '/img/urbanizacion.jpg',
                            //     },
                            //     {
                            //         url: '/img/home/logo-home.jpeg',
                            //     },
                            // ]
                        }
                    />
                </div>
                <div className={classes.containerBody}>
                    {/* <>dasd</> */}
                </div>
                {/* <div className={classes.containerImage}>
                    <DashBoardPagosRealizados />
                </div> */}
            </Container>
        </LayoutTituloPagina>
    )
}

export default ScreenHome
