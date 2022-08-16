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
import { useState, useCallback, useEffect, FC, useMemo } from 'react'
import ModalAuth from '../core/input/dialog/modal-dialog'
import * as yup from 'yup'
import { useFormik } from 'formik'
import FormControlHeader from '../core/input/form-control-select'
import { TipoUsuario, tipoUsuarios } from '../core/input/dateSelect'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import {
    usePostUsuarioMutation,
    useListadoUsuario,
    IResultUsuarioQuery,
    useUpdateUsuarioMutation,
    useListadoUsuarioSinFamilares,
} from './use-usuario'
import { useListaTipoIdentificacionQuery } from '../mantenimento/tipo-identificacion/use-tipo-identificacion'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { equals, isNil } from 'ramda'
import { useUpdateIntegranteMutation } from '../integrante/use-intergrante'
import { useRouter } from 'next/router'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import { useListaParentescoQuery } from '../mantenimento/parentesco/use-parentesco'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'

import esLocale from 'date-fns/locale/es'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            // padding: '60px',
            // minWidth: "820px",
            padding: theme.spacing(5),
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
    nombres: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    apellidos: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
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
    idTipoIdentificacion: undefined,
})

interface IProps {
    dataUsuario?: IResultUsuarioQuery
    id?: number
}

export const FormIngresarUsuario: FC<IProps> = ({ dataUsuario, id }) => {
    const init = useMemo(() => {
        return isNotNilOrEmpty(dataUsuario)
            ? {
                  tipo_usuario: dataUsuario?.tipo_usuario,
                  num_identificacion: dataUsuario?.num_identificacion,
                  nombres: dataUsuario?.nombres,
                  apellidos: dataUsuario?.apellidos,
                  email: dataUsuario?.email,
                  telefono: dataUsuario?.telefono,
                  idTipoIdentificacion: dataUsuario?.tipoIdentificacion.id,
              }
            : initialValues
    }, [dataUsuario])
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)

    const [idGrupoFamiliarSeleccionado, setIdGrupoFamiliarSeleccionado] =
        useState<number>()

    const [fechaDeNaciemiento, setFechaDeNaciemiento] = useState<Date>()

    const [idParentescoSeleccionado, setIdParentescoSeleccionado] =
        useState<number>()

    const [generoSeleccionado, setGeneroSeleccionado] = useState<string>()

    const [mutatePostUsuario] = usePostUsuarioMutation()

    const [mutateUpdateUsuario] = useUpdateUsuarioMutation()
    const { refetch } = useListadoUsuario()
    const {
        data: dataGruposFamiliaresSinUsuarios,
        loading: loadingGruposFamilairesSinUsuarios,
        refetch: refecthListadoUsuarioSinFamiliares,
    } = useListadoUsuarioSinFamilares()

    const { data: dataParentesco, loading: loadingParentesco } =
        useListaParentescoQuery()

    const { data: dataGrupos, loading: loadingGrupos } =
        useListarGrupoFamiliar()

    const listadoParentesco = useMemo(() => {
        if (
            !loadingParentesco &&
            dataParentesco &&
            dataParentesco.ListaParentesco
        ) {
            return dataParentesco.ListaParentesco
        }
        return []
    }, [loadingParentesco, dataParentesco])

    const gruposFamiliares = useMemo(() => {
        if (!loadingGrupos && dataGrupos && dataGrupos.ListaGruposFamiliares) {
            return dataGrupos.ListaGruposFamiliares
        }
        return []
    }, [dataGrupos, loadingGrupos])

    const gruposFamiliaresSinUsuarios = useMemo(() => {
        if (
            !loadingGruposFamilairesSinUsuarios &&
            dataGruposFamiliaresSinUsuarios &&
            dataGruposFamiliaresSinUsuarios.ListaUsuarioSinGrupoFamiliar
        ) {
            return dataGruposFamiliaresSinUsuarios.ListaUsuarioSinGrupoFamiliar.map(
                ({ id }) => id
            )
        }
        return []
    }, [dataGruposFamiliaresSinUsuarios, loadingGruposFamilairesSinUsuarios])

    const {
        data: dataTipoID,
        loading: loadingTipoID,
        error: errorTipoID,
    } = useListaTipoIdentificacionQuery()

    const verifGrupoFamiliar = useMemo(() => {
        if (idGrupoFamiliarSeleccionado) {
            return gruposFamiliaresSinUsuarios.includes(
                idGrupoFamiliarSeleccionado
            )
        }
        return false
    }, [idGrupoFamiliarSeleccionado, gruposFamiliaresSinUsuarios])

    const onCloseModalAuth = () => {
        if (openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/usuario/ingresar' })
            })
        } else {
            setOpenModalMsj(false)
        }
    }

    const onSubmit = useCallback(
        async ({
            tipo_usuario,
            num_identificacion,
            nombres,
            apellidos,
            email,
            telefono,
            idTipoIdentificacion,
        }) => {
            try {
                console.log(
                    'Values: ',
                    String(tipo_usuario).trim(),
                    num_identificacion,
                    nombres,
                    apellidos,
                    email,
                    telefono,
                    idTipoIdentificacion
                )
                if (
                    tipo_usuario === TipoUsuario.MORADOR &&
                    (!idGrupoFamiliarSeleccionado ||
                        !fechaDeNaciemiento ||
                        !idParentescoSeleccionado ||
                        !generoSeleccionado)
                ) {
                    console.log('No entre')
                    return
                }

                if (
                    // isNotNilOrEmpty(idGrupoFamiliar) &&
                    isNotNilOrEmpty(tipo_usuario) &&
                    isNotNilOrEmpty(nombres) &&
                    isNotNilOrEmpty(num_identificacion) &&
                    isNotNilOrEmpty(nombres) &&
                    isNotNilOrEmpty(apellidos) &&
                    isNotNilOrEmpty(email) &&
                    isNotNilOrEmpty(idTipoIdentificacion) &&
                    isNotNilOrEmpty(telefono)
                ) {
                    const variablesPost =
                        tipo_usuario === TipoUsuario.MORADOR
                            ? {
                                  tipo_usuario: tipo_usuario,
                                  num_identificacion: num_identificacion,
                                  nombres: String(nombres).trim().toUpperCase(),
                                  apellidos: String(apellidos).toUpperCase(),
                                  email: email,
                                  telefono: telefono,
                                  idTipoIdentificacion: idTipoIdentificacion,
                                  idGrupoFamiliar: idGrupoFamiliarSeleccionado,
                                  idParentesco: idParentescoSeleccionado,
                                  genero: generoSeleccionado,
                                  fecha_nacimiento: fechaDeNaciemiento,
                              }
                            : {
                                  tipo_usuario: tipo_usuario,
                                  num_identificacion: num_identificacion,
                                  nombres: nombres,
                                  apellidos: apellidos,
                                  email: email,
                                  telefono: telefono,
                                  idTipoIdentificacion: idTipoIdentificacion,
                              }
                    setLoadingMutate(true)
                    const { data } = isNil(dataUsuario)
                        ? await mutatePostUsuario({
                              variables: {
                                  ...variablesPost,
                                  //   tipo_usuario: tipo_usuario,
                                  //   num_identificacion: num_identificacion,
                                  //   nombres: nombres,
                                  //   apellidos: apellidos,
                                  //   email: email,
                                  //   telefono: telefono,
                                  //   idTipoIdentificacion: idTipoIdentificacion,
                              },
                          })
                        : await mutateUpdateUsuario({
                              variables: {
                                  id: id,
                                  tipo_usuario: tipo_usuario,
                                  num_identificacion: num_identificacion,
                                  nombres: String(nombres).toUpperCase(),
                                  apellidos: String(apellidos).toUpperCase(),
                                  email: email,
                                  telefono: telefono,
                                  idTipoIdentificacion: idTipoIdentificacion,
                              },
                          })
                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = isNotNilOrEmpty(
                            data.UpdateUsuario
                        )
                            ? data.UpdateUsuario
                            : data.PostUsuario

                        setTitleModalMsj(message)
                        if (code === 200) {
                            await refecthListadoUsuarioSinFamiliares()
                            if (isNotNilOrEmpty(data.UpdateUsuario)) {
                                setLoadingMutate(false)
                                setBoolPut(true)
                                setOpenModalMsj(true)
                                return
                            }

                            await refetch()
                            setErrorModal(false)

                            setIdGrupoFamiliarSeleccionado(undefined)
                            setFechaDeNaciemiento(undefined)
                            setIdParentescoSeleccionado(undefined)
                            setGeneroSeleccionado(undefined)
                            resetForm()
                        } else {
                            setErrorModal(true)
                        }
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(true)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
                // setLoadingMutate(false)
            } catch (err: any) {
                setLoadingMutate(false)
                console.log('error : ', err as Error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                // setMensajeModalMsj(
                //     'Usuario no ha sido guardado: ' + err.message
                // )
                //setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            id,
            dataUsuario,
            idGrupoFamiliarSeleccionado,
            fechaDeNaciemiento,
            idParentescoSeleccionado,
            generoSeleccionado,
        ]
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
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    useEffect(() => {
        if (values.tipo_usuario !== TipoUsuario.MORADOR) {
            setIdGrupoFamiliarSeleccionado(undefined)
            setIdParentescoSeleccionado(undefined)
            setFechaDeNaciemiento(undefined)
            setGeneroSeleccionado(undefined)
        }
    }, [values.tipo_usuario])

    // useEffect(() => {
    //     console.log('Values: ', values)
    // }, [values])

    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    //  setOpenModal={setOpenModalMsj}
                    onClose={() => {
                        onCloseModalAuth()
                    }}
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
                <div>
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
                        inputProps={{ style: { textTransform: 'uppercase' } }}
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
                        inputProps={{ style: { textTransform: 'uppercase' } }}
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
                    {idGrupoFamiliarSeleccionado && !verifGrupoFamiliar && (
                        <Typography variant="overline" color="error">
                            Este grupo Familiar ya tiene asignado un Usuario
                        </Typography>
                    )}
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

                    {!dataUsuario &&
                        values.tipo_usuario === TipoUsuario.MORADOR && (
                            <>
                                <FormControlHeader
                                    id="grupoFamiliar"
                                    classes={classes}
                                    handleChange={(e) =>
                                        setIdGrupoFamiliarSeleccionado(
                                            Number(e.target.value)
                                        )
                                    }
                                    handleBlur={() => console.log('')}
                                    labetTitulo="Grupo Familiar"
                                    value={idGrupoFamiliarSeleccionado}
                                >
                                    {gruposFamiliares.map(
                                        ({ id, nombre_familiar }) => {
                                            return (
                                                <MenuItem
                                                    key={id}
                                                    style={{
                                                        backgroundColor:
                                                            gruposFamiliaresSinUsuarios.includes(
                                                                id!
                                                            )
                                                                ? colors
                                                                      .green[100]
                                                                : 'white',
                                                    }}
                                                    value={id}
                                                    selected={
                                                        idGrupoFamiliarSeleccionado ===
                                                        id
                                                    }
                                                >
                                                    {nombre_familiar}
                                                </MenuItem>
                                            )
                                        }
                                    )}
                                </FormControlHeader>
                            </>
                        )}
                </div>

                <div>
                    {!dataUsuario &&
                        values.tipo_usuario === TipoUsuario.MORADOR && (
                            <>
                                <FormControlHeader
                                    id="parenesco"
                                    classes={classes}
                                    handleChange={(e) =>
                                        setIdParentescoSeleccionado(
                                            Number(e.target.value)
                                        )
                                    }
                                    handleBlur={() => console.log('')}
                                    labetTitulo="Parentesco"
                                    value={idParentescoSeleccionado}
                                >
                                    {listadoParentesco.map(
                                        ({ id, parentesco }) => {
                                            return (
                                                <MenuItem
                                                    selected={
                                                        idParentescoSeleccionado ===
                                                        Number(id)
                                                    }
                                                    key={id}
                                                    value={id}
                                                >
                                                    {parentesco}
                                                </MenuItem>
                                            )
                                        }
                                    )}
                                </FormControlHeader>

                                <FormControlHeader
                                    classes={classes}
                                    handleBlur={() => console.log('')}
                                    id="genero"
                                    handleChange={(e) =>
                                        setGeneroSeleccionado(e.target.value)
                                    }
                                    labetTitulo="Genero"
                                    value={generoSeleccionado}
                                >
                                    <MenuItem
                                        key="ListGeneroMasculino"
                                        value={'masculino'}
                                        selected={
                                            generoSeleccionado === 'masculino'
                                        }
                                    >
                                        Masculino
                                    </MenuItem>
                                    <MenuItem
                                        key="ListGeneroFemenino"
                                        value={'femenino'}
                                        selected={
                                            generoSeleccionado === 'femenino'
                                        }
                                    >
                                        Femenino
                                    </MenuItem>
                                    <MenuItem
                                        key="ListGeneroOtro"
                                        value={'otro'}
                                        selected={generoSeleccionado === 'otro'}
                                    >
                                        Otro
                                    </MenuItem>
                                </FormControlHeader>
                            </>
                        )}
                </div>

                <div>
                    {!dataUsuario &&
                        values.tipo_usuario === TipoUsuario.MORADOR && (
                            <MuiPickersUtilsProvider
                                locale={esLocale}
                                utils={DateFnsUtils}
                            >
                                <KeyboardDatePicker
                                    className={classes.textbox}
                                    name={'fechaDeNaciemiento'}
                                    label={'Fecha de Nacimiento'}
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    value={fechaDeNaciemiento}
                                    // onChange={handleChange}
                                    onChange={(value) =>
                                        setFechaDeNaciemiento(value as Date)
                                    }
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    required
                                />
                            </MuiPickersUtilsProvider>
                        )}
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
