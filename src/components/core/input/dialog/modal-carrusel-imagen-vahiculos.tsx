import {
    makeStyles,
    createStyles,
    Paper,
    colors,
    CircularProgress,
} from '@material-ui/core'
import { FC, useEffect } from 'react'
import Modal from '@material-ui/core/Modal'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Image from 'next/image'
import { useGetVehiculoQuery } from '../../../vehiculo/use-vehiculo'
import { isNilOrEmpty } from '../../../../utils/is-nil-empty'
import { isNil } from 'ramda'

interface IProps {
    open: boolean
    handleClose: () => void
    id?: number
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(2),
            // borderRadius: "12px",
        },
        paper: {
            backgroundColor: colors.grey[400],
            // border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        img: {
            // width: "100px",
            // height: "100px",
            borderRadius: '12px',
        },
        containerPaperLoading: {
            padding: theme.spacing(10),
        },
    })
)

export const CarruselVehiculoImagenModal: FC<IProps> = ({
    handleClose,
    open,
    id,
}) => {
    const classes = useStyles()

    const { data, loading, error } = useGetVehiculoQuery(id)
    // useEffect(() => {
    //   if (!loading && !isNilOrEmpty(data)) {
    //     console.log("data: ", data);
    //   }
    // }, [data, loading]);
    return (
        <div className={classes.root}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    {loading ? (
                        <div>
                            <Paper className={classes.paper}>
                                <CircularProgress />
                            </Paper>
                        </div>
                    ) : !loading &&
                      !isNil(data) &&
                      !isNil(data.GetVehiculos) ? (
                        <Paper className={classes.paper}>
                            <Carousel
                                showIndicators={true}
                                showStatus={false}
                                showArrows={true}
                                autoPlay={true}
                                showThumbs={false}
                                // animationHandler={"fade"}
                                // infiniteLoop={true}
                                // className={classes.carrusel}
                            >
                                <div>
                                    <img
                                        width={400}
                                        height={400}
                                        className={classes.img}
                                        src={
                                            isNilOrEmpty(
                                                data.GetVehiculos
                                                    .matriculaFrontal
                                            )
                                                ? '/img/image-not-found.png'
                                                : String(
                                                      data.GetVehiculos
                                                          .matriculaFrontal
                                                  )
                                        }
                                        alt={'matricula-frontal'}
                                    />
                                    <p className="legend">Matricula Frontal</p>
                                </div>
                                <div>
                                    <img
                                        width={400}
                                        height={400}
                                        className={classes.img}
                                        src={
                                            isNilOrEmpty(
                                                data.GetVehiculos
                                                    .matriculaReverso
                                            )
                                                ? '/img/image-not-found.png'
                                                : String(
                                                      data.GetVehiculos
                                                          .matriculaReverso
                                                  )
                                        }
                                        alt={'matricula-reverso'}
                                    />
                                    <p className="legend">Matricula Reverso</p>
                                </div>
                                <div>
                                    <img
                                        width={400}
                                        height={400}
                                        className={classes.img}
                                        src={
                                            isNilOrEmpty(
                                                data.GetVehiculos.cedulaFrontal
                                            )
                                                ? '/img/image-not-found.png'
                                                : data.GetVehiculos
                                                      .cedulaFrontal
                                        }
                                        alt={'cedula-frontal'}
                                    />
                                    <p className="legend">Cedula Frontal</p>
                                </div>
                                <div>
                                    <img
                                        width={400}
                                        height={400}
                                        className={classes.img}
                                        src={
                                            isNilOrEmpty(
                                                data.GetVehiculos.cedulaReverso
                                            )
                                                ? '/img/image-not-found.png'
                                                : data.GetVehiculos
                                                      .cedulaReverso
                                        }
                                        alt={'cedula-reverso'}
                                    />
                                    <p className="legend">Cedula Reverso</p>
                                </div>
                            </Carousel>
                        </Paper>
                    ) : (
                        <Paper>NO data</Paper>
                    )}
                </div>
            </Modal>
        </div>
    )
}
