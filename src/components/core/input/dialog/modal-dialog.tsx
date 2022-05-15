import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { Button, Paper, Typography } from '@material-ui/core'
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone'
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            borderRadius: 10,
            minWidth: theme.spacing(35),
        },
        containerTitle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconInfo: {
            color: theme.palette.info.dark,
            marginRight: theme.spacing(2),
        },
        iconError: {
            color: theme.palette.error.light,
            marginRight: theme.spacing(2),
        },
        titleInfo: {
            fontSize: theme.typography.pxToRem(23),
            fontWeight: "bold",
            color: theme.palette.info.dark,
        },
        titleError: {
            fontSize: theme.typography.pxToRem(23),
            fontWeight: "bold",
            color: theme.palette.error.dark,
        },
        contentButton: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            marginTop: theme.spacing(3),
        },
        buttonInfo: {
            backgroundColor: theme.palette.info.dark,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.info.main,
            },
        },
        buttonError: {
            backgroundColor: theme.palette.error.dark,
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.error.main,
            },
        },
    })
)

interface IProps {
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    message: string
    error?: boolean
}

const ModalAuth: React.FC<IProps> = ({
    openModal,
    setOpenModal,
    title,
    message,
    error = true,
}) => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(openModal)

    const handleClose = () => {
        setOpenModal(false)
    }

    return (
        <div>
            {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Paper className={classes.paper}>
                        <div className={classes.containerTitle}>
                            <Typography
                                className={
                                    error
                                        ? classes.titleError
                                        : classes.titleInfo
                                }
                                variant="subtitle1"
                            >
                                {error ? 'Error' : 'Info'}
                            </Typography>
                        </div>
                        <div
                            style={{ marginTop: 10 }}
                            className={classes.containerTitle}
                        >
                            {error ? (
                                <ErrorTwoToneIcon
                                    fontSize="large"
                                    className={classes.iconError}
                                />
                            ) : (
                                <InfoTwoToneIcon
                                    fontSize="large"
                                    className={classes.iconInfo}
                                />
                            )}
                            <Typography variant="body2">{title}</Typography>
                        </div>
                        <div className={classes.contentButton}>
                            <Button
                                className={
                                    error
                                        ? classes.buttonError
                                        : classes.buttonInfo
                                }
                                onClick={handleClose}
                            >
                                Cerrar
                            </Button>
                        </div>

                        {/* <h2 id="transition-modal-title">{title}</h2> */}
                        {/* <p id="transition-modal-description">{message}</p> */}
                    </Paper>
                </Fade>
            </Modal>
        </div>
    )
}

export default ModalAuth
