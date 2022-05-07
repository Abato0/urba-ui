/* eslint-disable @next/next/no-img-element */
import { makeStyles, createStyles } from '@material-ui/core'
import { FC } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const useStyles = makeStyles((theme) =>
    createStyles({
        imgContainer: {
            display: 'flex',
            flexDirection: 'column',
            margin: theme.spacing(1),
            borderRadius: '4px',
            width: '70%',
        },
        carrusel: {
            // maxWidth: "350px",
            // width: '450px',
            // height: '250px',
            borderRadius: '12px',
            // backgroundColor: "red"
        },
    })
)

interface IProps {
    imagenes: {
        url: string
    }[]
}

export const CarruselDashboardHorizontal: FC<IProps> = ({ imagenes }) => {
    const classes = useStyles()

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
                {imagenes.map(({ url }, index) => {
                    return (
                        <div key={index}>
                            <img
                                width={450}
                                height={250}
                                // className={classes.img}
                                src={url}
                                alt={'img'}
                            />
                        </div>
                    )
                })}

                {/* <div>
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
