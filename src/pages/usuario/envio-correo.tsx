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
    Button,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { SelectChangeEvent } from '@mui/material'
import { SelectHeader } from '../../components/core/input/select/select-header'
import {
    useListadoUsuario,
    IResultUsuarioQuery,
    useEnvioCorreoMutation,
} from '../../components/usuarios/use-usuario'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import AddIcon from '@material-ui/icons/Add'
import EmailIcon from '@material-ui/icons/Email'
import DeleteIcon from '@material-ui/icons/Delete'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            // padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            // width:"100px"
            // backgroundColor: "red",
            // width: "90%"
            margin: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            width: '50%',
            minWidth: theme.spacing(45),

            // padding: '60px',
        },
        formControl: {
            // margin: theme.spacing(1),
            // minWidth: 220,
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
            // fontFamily:"bold",
            color: 'white',
            fontSize: theme.typography.pxToRem(9),
            overflow: 'hidden',
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
    // titulo: 'CEP28M',
    mensaje: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    asunto: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    // titulo: yup.string().required('Campo requerido'),
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
        async ({ asunto, mensaje }) => {
            try {
                if (arrUsuarios.length > 0) {
                    setLoadingMutate(true)
                    const { data } = await mutate({
                        variables: {
                            emails: arrUsuarios.map(({ email }) => email),
                            asunto: String(asunto).toUpperCase(),
                            titulo: 'PCE28M',
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const seleccionarTodosUsuarios = () => {
        if (dataUsuario && dataUsuario.ListaUsuario) {
            setArrUsuarios(dataUsuario.ListaUsuario)
        }
    }

    const vaciarUsuarios = () => {
        setArrUsuarios([])
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
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}
            >
                <Box className={classes.root}>
                    <>
                        {openModalMsj && (
                            <ModalAuth
                                openModal={openModalMsj}
                                //  setOpenModal={setOpenModalMsj}
                                onClose={() => setOpenModalMsj(false)}
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
                        <div style={{ marginBottom: '4%' }}>
                            <Button
                                style={{
                                    backgroundColor: colors.deepPurple[400],
                                    color: 'white',
                                }}
                                onClick={seleccionarTodosUsuarios}
                            >
                                Seleccionar todos los usuarios
                            </Button>
                        </div>
                        <div
                            style={{
                                marginBottom: '20px',

                                width: '100%',
                            }}
                            // style={{
                            //     display: 'flex',
                            //     flexDirection: 'column',
                            //     justifyContent: 'space-evenly',
                            //     width: '100%',
                            //     alignItems: "center"
                            // }}
                        >
                            <SelectHeader
                                style={{ width: '40%' }}
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
                                    dataUsuario.ListaUsuario.filter(
                                        ({ tipo_usuario }) =>
                                            TipoUsuario.MORADOR === tipo_usuario
                                    )
                                        .sort((a, b) =>
                                            a.apellidos.localeCompare(
                                                b.apellidos
                                            )
                                        )
                                        .map(
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
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                    >
                                                        {`${user}  - ${tipo_usuario} - ${apellidos} ${nombres}`}
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
                                    width: '90%',
                                    // maxWidth: '540px',
                                    // maxHeight: '200px',
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
                                                {
                                                    id,
                                                    user,
                                                    tipo_usuario,
                                                    nombres,
                                                    apellidos,
                                                    num_identificacion,
                                                },
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
                                                                        overflow:
                                                                            'auto',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        className={
                                                                            classes.itemLabel
                                                                        }
                                                                        variant="overline"
                                                                    >{`${num_identificacion}`}</Typography>
                                                                    <Typography
                                                                        className={
                                                                            classes.itemLabel
                                                                        }
                                                                        variant="overline"
                                                                    >{`${nombres} ${apellidos}`}</Typography>
                                                                </div>

                                                                <Fab
                                                                    size="small"
                                                                    color="primary"
                                                                    aria-label="add"
                                                                    style={
                                                                        {
                                                                            // padding: 12,
                                                                            // marginRight: 10,
                                                                        }
                                                                    }
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
                        <div style={{ marginTop: '3%', width: '90%' }}>
                            {/* <TextField
                                style={{ display: "none" }}
                                className={classes.textbox}
                                id="titulo"
                                name="titulo"
                                label="Titulo"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={"CEP28M"}
                                error={
                                    touched.titulo &&
                                    isNotNilOrEmpty(errors.titulo)
                                }
                                helperText={
                                    touched.titulo ? errors.titulo : undefined
                                }
                                required
                            /> */}
                            <TextField
                                className={classes.textbox}
                                style={{ width: '100%' }}
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
                                inputProps={{
                                    style: { textTransform: 'uppercase' },
                                }}
                            />
                        </div>
                        <div style={{ width: '90%' }}>
                            <TextField
                                className={classes.textbox}
                                style={{
                                    width: '100%',
                                }}
                                // style={{
                                //     width: '450px',
                                // }}
                                rows={5}
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
                                // inputProps={{
                                //     style: { textTransform: 'uppercase' },
                                // }}
                            />
                        </div>
                        <div
                            className={classes.contentButtons}
                            style={{ marginBottom: '2%', marginRight: '8%' }}
                        >
                            <div></div>
                            <LoadingButton
                                loading={loadingMutate}
                                loadingPosition="start"
                                type="submit"
                                variant="text"
                                startIcon={<EmailIcon />}
                            >
                                Enviar
                            </LoadingButton>
                        </div>
                    </form>
                </Box>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default EnvioCorreo
