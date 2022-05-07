/* eslint-disable @next/next/no-img-element */
import { makeStyles, createStyles } from '@material-ui/core'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

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

export const CarruselImagenesLogin = () => {
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
                <div>
                    <img
                        width={450}
                        height={570}
                        // className={classes.img}
                        src={'/img/login/iowa-city.jpg'}
                        alt={'img'}
                    />
                </div>
                <div>
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
                </div>
            </Carousel>
        </div>
    )
}
