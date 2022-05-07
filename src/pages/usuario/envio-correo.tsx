import {
    makeStyles,
    createStyles,
    colors,
    Box,
    MenuItem,
    Fab,
    Grid,
    Paper,
    Typography,
    TextField,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import AppLayout from '../../components/layout/app-layout'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { SelectChangeEvent } from '@mui/material'
import { SelectHeader } from '../../components/core/input/select/select-header'
import {
    useListadoUsuario,
    IResultUsuarioQuery,
    useEnvioCorreoMutation,
} from '../../components/usuarios/use-usuario'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import NavBar from '../../components/layout/app-bar'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            // width:"100px"
        },
        formControl: {
            // margin: theme.spacing(1),
            minWidth: 220,
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacing(2),
            // width: "100%",
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
        dropzone: {
            padding: theme.spacing(4),
            minWidth: 500,
        },
        button: {
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
                color: 'white',
            },
            color: 'white',
        },

        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
        },
        contentLastTextBox: {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
        },
        title: {
            fontSize: theme.typography.pxToRem(12),
            backgroundColor: colors.deepPurple[400],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            color: 'white',
            fontWeight: 'bolder',
        },
        paperListPago: {
            backgroundColor: colors.grey[700],
            marginBottom: theme.spacing(2),
            width: '100%',
        },
        itemListPago: {
            //   padding: theme.spacing(1),
            //   width: 100,
            backgroundColor: colors.deepPurple[400],
            height: '100%',
            width: '100%',
        },
        itemLabel: {
            // fontWeight: theme.typography.pxToRem(60),
            // fontFamily: theme.typography.fontWeightBold,
            color: 'white',
            fontSize: theme.typography.pxToRem(9),
            fontWeight: 600,
        },
        containerTitle: {
            margin: theme.spacing(2),
            backgroundColor: colors.grey[100],
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
        },
        titleForm: {
            fontSize: theme.typography.pxToRem(12),
            backgroundColor: colors.grey[200],
            borderRadius: theme.spacing(4),
        },
    })
)

const initialValues = Object.freeze({
    asunto: '',
    titulo: '',
    mensaje: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    asunto: yup.string().required('Campo requerido'),
    titulo: yup.string().required('Campo requerido'),
    mensaje: yup.string().required('Campo requerido'),
})

const EnvioCorreo = () => {
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const classes = useStyles()
    const router = useRouter()

    const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState<number>()
    const [arrUsuarios, setArrUsuarios] = useState<IResultUsuarioQuery[]>([])

    const [mutate] = useEnvioCorreoMutation()

    const {
        data: dataUsuario,
        loading: loadingUsuario,
        error: errorUsuario,
    } = useListadoUsuario()

    const onSubmit = useCallback(
        async ({ asunto, titulo, mensaje }) => {
            try {
                if (arrUsuarios.length > 0) {
                    setLoadingMutate(true)
                    const { data } = await mutate({
                        variables: {
                            emails: arrUsuarios.map(({ email }) => email),
                            asunto,
                            titulo,
                            mensaje,
                        },
                    })
                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = data.EnvioCorreo
                        setLoadingMutate(false)
                        setTitleModalMsj(message)
                        if (code === 200) {
                            setErrorModal(false)
                        }
                        setOpenModalMsj(true)
                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(false)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
            } catch (error) {
                setLoadingMutate(false)
                console.log('error.;', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'El correo no ha sido enviado: ' + (error as Error).message
                )
                setOpenModalMsj(true)
            }
        },
        [arrUsuarios]
    )

    const addUsuario = () => {
        if (
            idUsuarioSeleccionado &&
            dataUsuario &&
            dataUsuario.ListaUsuario &&
            !loadingUsuario
        ) {
            const resultUsuario = arrUsuarios.find(
                ({ id }) => id === idUsuarioSeleccionado
            )
            if (resultUsuario) {
                return
            }

            const getUsuarioSeleccionado = dataUsuario.ListaUsuario.find(
                (usuario) => usuario.id === idUsuarioSeleccionado
            )
            if (getUsuarioSeleccionado)
                setArrUsuarios([...arrUsuarios, getUsuarioSeleccionado])
        }
    }

    const removeUsuario = (idSeleccionado: number) => {
        if (idSeleccionado) {
            const filterUsuario = arrUsuarios.filter(
                ({ id }) => idSeleccionado !== id
            )

            setArrUsuarios(filterUsuario)
        }
    }

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        resetForm,
    } = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })

    return (
        <LayoutTituloPagina titulo="Envio de Correos">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <Box className={classes.root}>
                    <>
                        {openModalMsj && (
                            <ModalAuth
                                openModal={openModalMsj}
                                setOpenModal={setOpenModalMsj}
                                title={titleModalMsj}
                                message={mensajeModalMsj}
                                error={errorModal}
                            />
                        )}
                    </>

                    <form
                        action="#"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        className={classes.form}
                    >
                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.titleForm}
                            >
                                Ingresar los destinatarios
                            </Typography>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                width: '100%',
                            }}
                        >
                            <SelectHeader
                                id="id_usuario"
                                handleChange={(e: SelectChangeEvent) =>
                                    setIdUsuarioSeleccionado(
                                        Number(e.target.value)
                                    )
                                }
                                label="Usuarios"
                                value={idUsuarioSeleccionado}
                                // value={values.id_parentesco}
                            >
                                {!loadingUsuario &&
                                    dataUsuario &&
                                    isNotNilOrEmpty(dataUsuario.ListaUsuario) &&
                                    dataUsuario.ListaUsuario.map(
                                        (
                                            {
                                                id,
                                                user,
                                                nombres,
                                                apellidos,
                                                tipo_usuario,
                                            },
                                            index
                                        ) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={id}
                                                >
                                                    {`${user}  - ${tipo_usuario} - ${nombres} ${apellidos}`}
                                                </MenuItem>
                                            )
                                        }
                                    )}
                            </SelectHeader>

                            <Fab
                                size="small"
                                aria-label="add"
                                style={{
                                    marginTop: '14px',
                                    backgroundColor: colors.deepPurple[400],
                                }}
                                onClick={addUsuario}
                                // onClick={agregarPagoMantenimiento}
                            >
                                <AddIcon style={{ color: 'white' }} />
                            </Fab>
                        </div>
                        {arrUsuarios.length > 0 && (
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '540px',
                                    maxHeight: '200px',
                                    overflow: 'auto',
                                    borderRadius: 5,
                                }}
                            >
                                <div className={classes.title}>
                                    <Typography variant="overline">
                                        Destinatarios
                                    </Typography>
                                </div>
                                <Paper
                                    elevation={4}
                                    className={classes.paperListPago}
                                >
                                    <Grid
                                        container
                                        spacing={2}
                                        style={{
                                            padding: 15,
                                        }}
                                    >
                                        {arrUsuarios.map(
                                            (
                                                { id, user, tipo_usuario },
                                                index
                                            ) => {
                                                return (
                                                    <Grid
                                                        key={index}
                                                        item
                                                        xs={4}
                                                    >
                                                        <Paper
                                                            className={
                                                                classes.itemListPago
                                                            }
                                                            elevation={1}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    flexDirection:
                                                                        'row',
                                                                    justifyItems:
                                                                        'center',
                                                                    alignItems:
                                                                        'center',
                                                                    padding: 5,
                                                                    justifyContent:
                                                                        'space-around',
                                                                    // backgroundColor: "red",
                                                                    height: '100%',
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        flexDirection:
                                                                            'column',
                                                                        justifyItems:
                                                                            'center',
                                                                        alignItems:
                                                                            'center',

                                                                        width: '100%',
                                                                        height: '100%',
                                                                        padding: 5,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        className={
                                                                            classes.itemLabel
                                                                        }
                                                                        variant="overline"
                                                                    >{`${user}  `}</Typography>
                                                                    <Typography
                                                                        className={
                                                                            classes.itemLabel
                                                                        }
                                                                        variant="overline"
                                                                    >{`${tipo_usuario}`}</Typography>
                                                                </div>

                                                                <Fab
                                                                    size="small"
                                                                    color="primary"
                                                                    aria-label="add"
                                                                    style={{
                                                                        padding: 12,
                                                                        marginRight: 10,
                                                                    }}
                                                                    onClick={() =>
                                                                        removeUsuario(
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <DeleteIcon />
                                                                </Fab>
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                )
                                            }
                                        )}
                                    </Grid>
                                </Paper>
                            </div>
                        )}

                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.titleForm}
                            >
                                Ingresar los detalles del mensaje
                            </Typography>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <TextField
                                className={classes.textbox}
                                id="titulo"
                                name="titulo"
                                label="Titulo"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.titulo}
                                error={
                                    touched.titulo &&
                                    isNotNilOrEmpty(errors.titulo)
                                }
                                helperText={
                                    touched.titulo ? errors.titulo : undefined
                                }
                                required
                            />
                            <TextField
                                className={classes.textbox}
                                id="asunto"
                                name="asunto"
                                label="Asunto"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.asunto}
                                error={
                                    touched.asunto &&
                                    isNotNilOrEmpty(errors.asunto)
                                }
                                helperText={
                                    touched.asunto ? errors.asunto : undefined
                                }
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                className={classes.textbox}
                                style={{
                                    width: '450px',
                                }}
                                id="mensaje"
                                name="mensaje"
                                label="Mensaje"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                multiline
                                value={values.mensaje}
                                error={
                                    touched.mensaje &&
                                    isNotNilOrEmpty(errors.mensaje)
                                }
                                helperText={
                                    touched.mensaje ? errors.mensaje : undefined
                                }
                                required
                            />
                        </div>
                        <div className={classes.contentButtons}>
                            <div></div>
                            <LoadingButton
                                loading={loadingMutate}
                                loadingPosition="start"
                                type="submit"
                                variant="text"
                                startIcon={<SaveIcon />}
                            >
                                Guardar
                            </LoadingButton>
                        </div>
                    </form>
                </Box>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default EnvioCorreo
