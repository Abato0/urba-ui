import {
    Box,
    Button,
    ButtonGroup,
    makeStyles,
    Modal,
    createStyles,
} from '@material-ui/core'
import { FC, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import Image from 'next/image'
import { isEmpty } from 'ramda'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { Paper } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'

import { PlusCircle, MinusCircle, Reload } from 'mdi-material-ui'
import { isNotNilOrEmpty } from '../../../../utils/is-nil-empty'

interface IProps {
    open: boolean
    handleClose: () => void
    base64: string
    classes: ClassNameMap<any>
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        buttonGroup: {},
    })
)

const ModalImagen: FC<IProps> = ({ open, handleClose, base64, classes }) => {
    const classesRoot = useStyles()

    const [srcImage, setSrcImage] = useState(base64)
    return (
        <div className={classesRoot.root}>
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
                        //  transform: 'translate(-50%, -50%)',
                        width: 600,
                        height: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 5,
                    }}
                    style={{
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <TransformWrapper>
                        {({ zoomIn, zoomOut, resetTransform }) => {
                            return (
                                <Box className={classes.container}>
                                    <ButtonGroup
                                        // variant="contained"
                                        variant="text"
                                        aria-label="outlined primary button group"
                                        className={classesRoot.buttonGroup}
                                    >
                                        <IconButton
                                            color="secondary"
                                            onClick={() => zoomIn()}
                                        >
                                            <PlusCircle />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => zoomOut()}
                                        >
                                            <MinusCircle />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => resetTransform()}
                                        >
                                            <Reload />
                                        </IconButton>
                                    </ButtonGroup>
                                    <TransformComponent>
                                        <Box className={classes.image}>
                                            <Image
                                                src={
                                                    isNotNilOrEmpty(base64)
                                                        ? base64
                                                        : '/img/image-not-found.png'
                                                }
                                                // src={"/img/loading.png"}
                                                alt="Image"
                                                quality={70}
                                                width={400}
                                                height={400}
                                                blurDataURL={'/img/loading.png'}
                                                placeholder="blur"
                                                onError={() =>
                                                    setSrcImage(
                                                        '/img/image-not-found.png'
                                                    )
                                                }
                                            />
                                        </Box>
                                    </TransformComponent>
                                </Box>
                            )
                        }}
                    </TransformWrapper>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalImagen
