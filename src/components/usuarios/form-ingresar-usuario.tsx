import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    MenuItem,
    TextField,
    Button,
    Paper,
} from '@material-ui/core'
import { useState, useCallback, useEffect } from 'react'
import ModalAuth from '../core/input/dialog/modal-dialog'
import * as yup from 'yup'
import { useFormik } from 'formik'
import FormControlHeader from '../core/input/form-control-select'
import { tipoUsuarios } from '../core/input/dateSelect'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { usePostUsuarioMutation, useListadoUsuario } from './use-usuario'
import { useListaTipoIdentificacionQuery } from '../mantenimento/tipo-identificacion/use-tipo-identificacion'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { equals } from 'ramda'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(20),
            marginRight: theme.spacing(20),
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
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },

        button: {
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
                color: 'white',
            },
            color: 'white',
        },
        dropzone: {
            display: 'flex',
            justifyContent: 'center',
            // alignItems: "center",
            padding: theme.spacing(4),
            minWidth: 500,
            backgroundColor: colors.grey[700],
            color: 'white',
            maxWidth: 700,
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
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
        },
    })
)

const validationSchema = yup.object().shape({
    tipo_usuario: yup.string().required('Campo requerido'),
    num_identificacion: yup
        .string()
        .matches(/^[0-9]+$/, 'Solo números')
        .required('Campo requerido'),
    nombres: yup.string().required('Campo requerido'),
    apellidos: yup.string().required('Campo requerido'),
    email: yup
        .string()
        .email('Debe ser un correo electronico')
        .required('Campo requerido'),
    telefono: yup
        .string()
        .matches(/^[0-9]+$/, 'Solo números')
        .required('Campo requerido'),
    idTipoIdentificacion: yup.number().required('Campo requerido'),
})

const initialValues = Object.freeze({
    tipo_usuario: '',
    num_identificacion: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    idTipoIdentificacion: 0,
})

export const FormIngresarUsuario = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [mutate] = usePostUsuarioMutation()
    const { refetch } = useListadoUsuario()

    const {
        data: dataTipoID,
        loading: loadingTipoID,
        error: errorTipoID,
    } = useListaTipoIdentificacionQuery()

    const onSubmit = useCallback(
        async (
            {
                tipo_usuario,
                num_identificacion,
                nombres,
                apellidos,
                email,
                telefono,
                idTipoIdentificacion,
            },
            { }
        ) => {
            console.log('dasdasdasdf')
            if (
                // isNotNilOrEmpty(idGrupoFamiliar) &&
                isNotNilOrEmpty(nombres) &&
                isNotNilOrEmpty(num_identificacion) &&
                !equals(idTipoIdentificacion, 0) &&
                isNotNilOrEmpty(nombres) &&
                isNotNilOrEmpty(apellidos) &&
                isNotNilOrEmpty(email) &&
                isNotNilOrEmpty(idTipoIdentificacion) &&
                isNotNilOrEmpty(telefono)
            ) {
                setLoadingMutate(true)
                const { data, loading, error } = await mutate({
                    variables: {
                        tipo_usuario: tipo_usuario,
                        num_identificacion: num_identificacion,
                        nombres: nombres,
                        apellidos: apellidos,
                        email: email,
                        telefono: telefono,
                        idTipoIdentificacion: idTipoIdentificacion,
                    },
                })
                if (
                    !loading &&
                    isNotNilOrEmpty(data) &&
                    isNotNilOrEmpty(data.PostUsuario)
                ) {
                    const { code, message } = data.PostUsuario

                    setErrorModal(true)
                    if (code === 200) {
                        await refetch()
                        setErrorModal(false)
                        resetForm()
                    }
                    setLoadingMutate(false)

                    setOpenModalMsj(true)
                    setTitleModalMsj(message)
                } else if (!loading && data === null) {
                    setLoadingMutate(false)
                    setOpenModalMsj(true)
                    setTitleModalMsj('Usuario no autorizado')
                    setErrorModal(true)
                }
            }

            try {
            } catch (err: any) {
                setLoadingMutate(false)
                console.log('error : ', err)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'Usuario no ha sido guardado: ' + err.message
                )
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        isSubmitting,
        touched,
        setFieldValue,
        resetForm,
        values,
    } = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })

    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            {/* <div className={classes.title}>
        <Typography variant="overline">Creación de Usuario</Typography>
      </div> */}

            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="idTipoIdentificacion"
                        handleChange={handleChange}
                        labetTitulo=" Tipo de documento de identidad"
                        value={values.idTipoIdentificacion}
                    >
                        {!loadingTipoID &&
                            dataTipoID &&
                            isNotNilOrEmpty(
                                dataTipoID.ListaTipoIdentificacion
                            ) &&
                            dataTipoID.ListaTipoIdentificacion.map(
                                ({ id, tipo_identificacion }) => {
                                    return (
                                        <MenuItem key={id} value={id}>
                                            {tipo_identificacion}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>

                    <TextField
                        className={classes.textbox}
                        id="num_identificacion"
                        name="num_identificacion"
                        label="Numero de identificación"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.num_identificacion}
                        error={
                            touched.num_identificacion &&
                            isNotNilOrEmpty(errors.num_identificacion)
                        }
                        helperText={
                            touched.num_identificacion
                                ? errors.num_identificacion
                                : undefined
                        }
                        required
                    />
                </div>

                <div>
                    <TextField
                        className={classes.textbox}
                        id="nombres"
                        name="nombres"
                        label="Nombres"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nombres}
                        error={
                            touched.nombres && isNotNilOrEmpty(errors.nombres)
                        }
                        helperText={
                            touched.nombres ? errors.nombres : undefined
                        }
                        required
                    />
                    <TextField
                        className={classes.textbox}
                        id="apellidos"
                        name="apellidos"
                        label="Apellidos"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.apellidos}
                        error={
                            touched.apellidos &&
                            isNotNilOrEmpty(errors.apellidos)
                        }
                        helperText={
                            touched.apellidos ? errors.apellidos : undefined
                        }
                        required
                    />
                </div>

                <div>
                    <TextField
                        className={classes.textbox}
                        id="email"
                        name="email"
                        label="Email"
                        type={'email'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        error={touched.email && isNotNilOrEmpty(errors.email)}
                        helperText={touched.email ? errors.email : undefined}
                        required
                    />
                    <TextField
                        className={classes.textbox}
                        id="telefono"
                        name="telefono"
                        label="Telefono"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.telefono}
                        error={
                            touched.telefono && isNotNilOrEmpty(errors.telefono)
                        }
                        helperText={
                            touched.telefono ? errors.telefono : undefined
                        }
                        required
                    />
                </div>

                <div>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="tipo_usuario"
                        handleChange={handleChange}
                        labetTitulo="Tipo de Usuario"
                        value={values.tipo_usuario}
                    >
                        {tipoUsuarios.map(({ label, value }) => {
                            return (
                                <MenuItem
                                    key={'Ingreso-Usuario-' + value}
                                    value={value}
                                >
                                    {label}
                                </MenuItem>
                            )
                        })}
                    </FormControlHeader>
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
    )
}
