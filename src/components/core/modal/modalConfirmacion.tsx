import {
    Backdrop,
    Button,
    Fade,
    Modal,
    Paper,
    Typography,
} from '@material-ui/core'
import { FC } from 'react'
import { useStylesModalDialog } from '../input/dialog/modal-dialog'
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone'

interface IProps {
    openModal: boolean
    onCancel: () => void
    onConfirm: () => void
    mensaje: string
}

export const ModalConfirmacion: FC<IProps> = ({
    mensaje,
    onCancel,
    onConfirm,
    openModal,
}) => {
    const classes = useStylesModalDialog()
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={onCancel}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={openModal}>
                <Paper style={{ maxWidth: '80%' }} className={classes.paper}>
                    <div className={classes.containerTitle}>
                        <Typography
                            className={classes.titleInfo}
                            variant="subtitle1"
                        >
                            {'Atención'}
                        </Typography>
                    </div>
                    <div
                        style={{ marginTop: 10 }}
                        className={classes.containerTitle}
                    >
                        <InfoTwoToneIcon
                            fontSize="large"
                            className={classes.iconInfo}
                        />

                        <Typography variant="body2">{mensaje}</Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: '5%',
                        }}
                    >
                        <Button
                            className={classes.buttonInfo}
                            onClick={onConfirm}
                        >
                            Aceptar
                        </Button>
                        <Button
                            className={classes.buttonError}
                            onClick={onCancel}
                        >
                            Cerrar
                        </Button>
                    </div>
                </Paper>
            </Fade>
        </Modal>
    )
}
