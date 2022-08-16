/* eslint-disable @next/next/no-img-element */
import {
    Box,
    Button,
    ButtonGroup,
    makeStyles,
    Modal,
    createStyles,
} from '@material-ui/core'
import { FC, useEffect, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import Image from 'next/image'
import { isEmpty } from 'ramda'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { Paper, colors } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { Cancel as CancelIcon } from '@material-ui/icons'
import { PlusCircle, MinusCircle, Reload } from 'mdi-material-ui'
import { isNotNilOrEmpty } from '../../../../utils/is-nil-empty'
import { getBase64 } from '../../../../utils/file-base64'
import { COLOR_PRIMARIO, COLOR_SECUDARIO } from '../../../../utils/keys'

interface IProps {
    open: boolean
    handleClose: () => void
    file?: File | null
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
        },
        paper: {
            //   backgroundColor: theme.palette.background.paper,
            backgroundColor: 'grey',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        buttonGroup: {
            backgroundColor: COLOR_PRIMARIO,
        },
        button: {
            color: 'white',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        image: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2),
            borderWidth: theme.spacing(0.2),
            border: 'solid',
            borderColor: COLOR_SECUDARIO,
            margin: theme.spacing(2),
            borderRadius: theme.spacing(2),
        },
    })
)

const ModalImagenFile: FC<IProps> = ({ open, handleClose, file }) => {
    const classesRoot = useStyles()

    const [fileImage, setFileImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const convertirImagen = async () => {
        try {
            setLoading(true)
            if (file) {
                //   console.log("file:", file);

                const dataFile = (await getBase64(file)) as string
                // console.log("dataFile: ", dataFile);
                setFileImage(`${dataFile}`)
                setLoading(false)
            } else {
                setFileImage(null)
                setLoading(false)
            }
        } catch (error) {
            console.log('error: ', (error as Error).message)
            setFileImage(null)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (file) {
            convertirImagen()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    return (
        <div className={classesRoot.root}>
            {!loading && fileImage ? (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            //   transform: 'translate(-50%, -50%)',
                            width: 600,
                            height: 600,
                            // bgcolor: "background.paper",

                            boxShadow: 24,
                            // p: 4,
                            borderRadius: 5,
                        }}
                        style={{
                            transform: 'translate(-50%, -50%)',
                            background:
                                'linear-gradient(to right, #e0eafc, #cfdef3)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <IconButton onClick={handleClose}>
                                <CancelIcon style={{ color: COLOR_PRIMARIO }} />
                            </IconButton>
                        </div>
                        <TransformWrapper>
                            {({ zoomIn, zoomOut, resetTransform }) => {
                                return (
                                    <Box className={classesRoot.container}>
                                        <ButtonGroup
                                            // variant="contained"
                                            variant="text"
                                            aria-label="outlined primary button group"
                                            className={classesRoot.buttonGroup}
                                        >
                                            <IconButton
                                                //  className={classesRoot.buttonGroup}
                                                // color="secondary"

                                                onClick={() => zoomIn()}
                                            >
                                                <PlusCircle
                                                    className={
                                                        classesRoot.button
                                                    }
                                                />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => zoomOut()}
                                            >
                                                <MinusCircle
                                                    className={
                                                        classesRoot.button
                                                    }
                                                />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => resetTransform()}
                                            >
                                                <Reload
                                                    className={
                                                        classesRoot.button
                                                    }
                                                />
                                            </IconButton>
                                        </ButtonGroup>
                                        <TransformComponent>
                                            <Box className={classesRoot.image}>
                                                <img
                                                    src={
                                                        isNotNilOrEmpty(
                                                            fileImage
                                                        )
                                                            ? fileImage
                                                            : '/img/image-not-found.png'
                                                    }
                                                    // src={"/img/loading.png"}
                                                    alt="Image"
                                                    // quality={70}
                                                    width={400}
                                                    height={400}
                                                    // blurDataURL={"/img/loading.png"}
                                                    placeholder="blur"
                                                    // onError={() =>
                                                    //   setFileImage("/img/image-not-found.png")
                                                    // }
                                                />
                                            </Box>
                                        </TransformComponent>
                                    </Box>
                                )
                            }}
                        </TransformWrapper>
                    </Box>
                </Modal>
            ) : null}
        </div>
    )
}

export default ModalImagenFile
