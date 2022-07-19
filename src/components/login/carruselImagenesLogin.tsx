/* eslint-disable @next/next/no-img-element */
import { makeStyles, createStyles } from '@material-ui/core'
import { ConeOff } from 'mdi-material-ui'
import { divide } from 'ramda'
import { FC, useEffect, useMemo, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { imagenesLogin } from '../../auth/auth-service'
import { LUGAR_IMAGEN } from '../../utils/keys'
import { useListadoImagenesBienvenidaQuery } from '../imagenes-de-bienvenida/use-imagenes-bienvenida'

const useStyles = makeStyles((theme) =>
    createStyles({
        imgContainer: {
            display: 'flex',
            flexDirection: 'column',
            margin: theme.spacing(1),
            borderRadius: '4px',
        },
        carrusel: {
            // maxWidth: "350px",
            width: '450px',
            height: '570px',
            borderRadius: '12px',
            // backgroundColor: "red"
        },
    })
)

interface IProps {
    imagenes: string[]
}

export const CarruselImagenesLogin: FC<IProps> = ({ imagenes }) => {
    const classes = useStyles();
    return (
        <div className={classes.imgContainer}>
            <Carousel
                showIndicators={true}
                showStatus={false}
                showArrows={false}
                autoPlay={true}
                infiniteLoop={true}
                className={classes.carrusel}
                showThumbs={false}
            >
                {
                    imagenes.map((url) => {
                        return (
                            <div key="1">
                                <img
                                    width={450}
                                    height={570}
                                    src={url}
                                    // className={classes.img}
                                    //src={'/img/login/iowa-city.jpg'}
                                    alt={'img'}
                                />
                            </div>)
                    })
                }

                {/* <div>
                    <img
                        width={450}
                        height={570}
                        // className={classes.img}
                        src={'/img/login/los-angeles.webp'}
                        alt={'img'}
                    />
                </div>
                <div>
                    <img
                        width={450}
                        height={570}
                        // className={classes.img}
                        src={'/img/login/rascacielo.jpg'}
                        alt={'img'}
                    />
                </div> */}
            </Carousel>
        </div>
    )
}
