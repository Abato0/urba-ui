/* eslint-disable react-hooks/rules-of-hooks */
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    MenuItem,
    TextField,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { equals, isEmpty, isNil } from 'ramda'
import { FC, useCallback, useState, useMemo } from 'react'
import * as yup from 'yup'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { parseStringDate } from '../../utils/parseDate'
import { TipoUsuario } from '../core/input/dateSelect'
import ModalAuth from '../core/input/dialog/modal-dialog'
import FormControlDate from '../core/input/form-control-date'
import FormControlHeader from '../core/input/form-control-select'
import { Checkbox } from '@material-ui/core'
import {
    IIntegranteVariables,
    useListadoIntegranteQuery,
    useListaIntergranteFilterQuery,
    usePostIntegranteMutation,
    useUpdateIntegranteMutation,
} from './use-intergrante'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import { useListaParentescoQuery } from '../mantenimento/parentesco/use-parentesco'
import { useRouter } from 'next/router'
import { useListaTipoIdentificacionQuery } from '../mantenimento/tipo-identificacion/use-tipo-identificacion'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { lightFormat } from 'date-fns'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'
import { userInfo } from '../../utils/states'
import { useRecoilValue } from 'recoil'

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
            marginBottom: theme.spacing(2),
            // display: 'flex',
            // flexDirection: 'row',
            // alignContent: 'center',
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

const initialValues = Object.freeze({
    idGrupoFamiliar: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    // status: "",
    fecha_nacimiento: new Date(),
    id_tipo_doc_identidad: 0,
    num_doc_identidad: '',
    // piso_ocupa: "",
    genero: '0',
    id_parentesco: 0,
    representante: 'I',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    idGrupoFamiliar: yup
        .number()
        .required('Campo requerido')
        .min(1, 'Campo requerido'),
    id_tipo_doc_identidad: yup
        .number()
        .required('Campo requerido')
        .min(1, 'Campo requerido'),
    num_doc_identidad: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .min(10, 'La cantidad de digitos debe ser mayor o igual 10 ')
        .max(15, 'La cantidad de digitos debe ser menor o igual 15 ')
        .required('Campo requerido'),
    nombre: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    apellido: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    telefono: yup
        .string()
        .matches(/^[0][0-9]+$/, 'Solo numeros y debe empezar con 09')
        .min(10, 'La cantidad de digitos debe ser igual 10 ')
        .max(10, 'La cantidad de digitos debe ser igual 10 ')
        .required('Campo requerido'),
    email: yup
        .string()
        .email('Campo debe ser un correo electronico')
        .nullable(),
    id_parentesco: yup
        .number()
        .min(1, 'Campo requerido')
        .required('Campo requerido'),
    // piso_ocupa: yup.string().required("Campo requerido"),
    genero: yup.string().required('Campo requerido').min(2, 'Campo requerido'),
    fecha_nacimiento: yup.date().required('Campo requerido'),
    representante: yup.string().required('Campo requerido'),
})

interface IProps {
    integrante?: IIntegranteVariables
}

interface IOnSubmit {
    idGrupoFamiliar?: number
    nombre: string
    apellido: string
    email: string
    telefono: string
    fecha_nacimiento: Date
    id_tipo_doc_identidad?: number
    num_doc_identidad: string
    genero: string
    id_parentesco?: number
    representante: string
}
const IntegranteFormIngresar: FC<IProps> = ({ integrante }) => {
    const router = useRouter()
    const classes = useStyles()

    const usuarioState = useRecoilValue(userInfo)

    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)
    // const { refetch } = useListaIntergranteFilterQuery({})

    const { data, loading } = useListadoIntegranteQuery()
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const { data: dataListaGrupoFamiliar, loading: loadingListaGrupoFamiliar } =
        useListarGrupoFamiliar()

    const [openModalConf, setOpenModalConf] = useState(false)

    const {
        data: dataListadoTipoID,
        loading: loadingListadoTipoID,
        error: errorListadoTipoID,
    } = useListaTipoIdentificacionQuery()

    const listadoIntegrantes = useMemo(() => {
        if (!loading && data && data.ListaIntegrantes) {
            return data.ListaIntegrantes
        }
        return []
    }, [loading, data])

    const verifRepresentante = (idGrupoFamiliar: number) => {
        const representante = listadoIntegrantes.some(
            ({ representante, grupoFamiliar }) =>
                representante === 'A' && grupoFamiliar.id === idGrupoFamiliar
        )
        return representante
    }

    const onIngresarIntegrante = async ({
        apellido,
        email,
        fecha_nacimiento,
        genero,
        nombre,
        num_doc_identidad,
        representante,
        telefono,
        idGrupoFamiliar,
        id_parentesco,
        id_tipo_doc_identidad,
    }: any) => {
        try {
            if (
                isNotNilOrEmpty(idGrupoFamiliar) &&
                !equals(idGrupoFamiliar, 0) &&
                isNotNilOrEmpty(apellido) &&
                isNotNilOrEmpty(num_doc_identidad) &&
                isNotNilOrEmpty(fecha_nacimiento) &&
                isNotNilOrEmpty(nombre) &&
                isNotNilOrEmpty(telefono) &&
                isNotNilOrEmpty(id_tipo_doc_identidad) &&
                !equals(id_tipo_doc_identidad, 0) &&
                isNotNilOrEmpty(id_parentesco) &&
                !equals(id_parentesco, 0) &&
                isNotNilOrEmpty(representante) &&
                isNotNilOrEmpty(genero)
            ) {
                // const result = verifRepresentante(idGrupoFamiliar)
                // if (result) {
                //     setOpenModalConf(true)
                //     return
                // }

                setLoadingMutate(true)
                const { data: dataMutate } = isNotNilOrEmpty(integrante)
                    ? await mutate({
                          variables: {
                              id: integrante?.id,
                              idGrupoFamiliar,
                              nombre: String(nombre).toUpperCase(),
                              apellido: String(apellido).toUpperCase(),
                              telefono,
                              id_parentesco,
                              fecha_nacimiento: lightFormat(
                                  new Date(fecha_nacimiento),
                                  'yyyy-MM-dd'
                              ),
                              id_tipo_doc_identidad,
                              num_doc_identidad,
                              representante,
                              genero,
                              email,
                          },
                      })
                    : await mutate({
                          variables: {
                              idGrupoFamiliar,
                              nombre: String(nombre).toUpperCase(),
                              apellido: String(apellido).toUpperCase(),
                              telefono,
                              id_parentesco,
                              fecha_nacimiento: lightFormat(
                                  new Date(fecha_nacimiento),
                                  'yyyy-MM-dd'
                              ),
                              id_tipo_doc_identidad,
                              num_doc_identidad,
                              representante,
                              genero,
                              email,
                          },
                      })

                // console.log('DataMutate: ', dataMutate)
                if (
                    isNotNilOrEmpty(dataMutate) &&
                    (dataMutate.PostIntegrante || dataMutate.UpdateIntegrante)
                ) {
                    const { code, message } = isNotNilOrEmpty(
                        dataMutate.PostIntegrante
                    )
                        ? dataMutate.PostIntegrante
                        : dataMutate.UpdateIntegrante
                    setTitleModalMsj(message)
                    setLoadingMutate(false)
                    setOpenModalMsj(true)

                    setErrorModal(code === 200 ? false : true)
                    if (code === 200) {
                        if (isNotNilOrEmpty(dataMutate.UpdateIntegrante)) {
                            setBoolPut(true)
                            return
                        }
                        // await refetch()
                        resetForm()
                    }

                    //  console.log('Messaget: ', message)

                    // resetForm();
                } else {
                    setLoadingMutate(false)
                    setTitleModalMsj('Usuario no autorizado')
                    setErrorModal(true)
                    setOpenModalMsj(true)
                }
            }
        } catch (err: any) {
            setLoadingMutate(false)
            console.log('error : ', err)
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setMensajeModalMsj('Integrante no ha sido guardado: ' + err.message)
            setOpenModalMsj(true)
        }
    }

    const closeModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/integrante/listado' })
            // })
        } else {
            setOpenModalMsj(false)
        }
    }

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         refetch().then(() => {
    //             router.push({ pathname: '/integrante/listado' })
    //         })
    //     }
    //     // }, 2000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boolPut, openModalMsj])

    const { data: dataParentesco, loading: loadingParentesco } =
        useListaParentescoQuery()

    const [mutate] = isNil(integrante)
        ? usePostIntegranteMutation()
        : useUpdateIntegranteMutation()

    // const [mutateUpdate] = useUpdateIntegranteMutation();

    // const [dataGrupoFamiliar, setDataGrupoFamiliar] = useState<
    //     IGrupoFamiliar[]
    // >([])

    const onSubmit = useCallback(
        async ({
            idGrupoFamiliar,
            nombre,
            apellido,
            telefono,
            id_parentesco,
            fecha_nacimiento,
            id_tipo_doc_identidad,
            num_doc_identidad,
            representante,
            genero,
            email,
        }) => {
            try {
                if (
                    isNotNilOrEmpty(idGrupoFamiliar) &&
                    !equals(idGrupoFamiliar, 0) &&
                    isNotNilOrEmpty(apellido) &&
                    isNotNilOrEmpty(num_doc_identidad) &&
                    isNotNilOrEmpty(fecha_nacimiento) &&
                    isNotNilOrEmpty(nombre) &&
                    isNotNilOrEmpty(telefono) &&
                    isNotNilOrEmpty(id_tipo_doc_identidad) &&
                    !equals(id_tipo_doc_identidad, 0) &&
                    isNotNilOrEmpty(id_parentesco) &&
                    !equals(id_parentesco, 0) &&
                    isNotNilOrEmpty(representante) &&
                    isNotNilOrEmpty(genero)
                ) {
                    const result = verifRepresentante(idGrupoFamiliar)
                    if (result && representante === 'A') {
                        setOpenModalConf(true)
                        return
                    }

                    setLoadingMutate(true)
                    const { data: dataMutate } = isNotNilOrEmpty(integrante)
                        ? await mutate({
                              variables: {
                                  id: integrante?.id,
                                  idGrupoFamiliar,
                                  nombre: String(nombre).toUpperCase(),
                                  apellido: String(apellido).toUpperCase(),
                                  telefono,
                                  id_parentesco,
                                  fecha_nacimiento: lightFormat(
                                      new Date(fecha_nacimiento),
                                      'yyyy-MM-dd'
                                  ),
                                  id_tipo_doc_identidad,
                                  num_doc_identidad,
                                  representante,
                                  genero,
                                  email,
                              },
                          })
                        : await mutate({
                              variables: {
                                  idGrupoFamiliar,
                                  nombre: String(nombre).toUpperCase(),
                                  apellido: String(apellido).toUpperCase(),
                                  telefono,
                                  id_parentesco,
                                  fecha_nacimiento: lightFormat(
                                      new Date(fecha_nacimiento),
                                      'yyyy-MM-dd'
                                  ),
                                  id_tipo_doc_identidad,
                                  num_doc_identidad,
                                  representante,
                                  genero,
                                  email,
                              },
                          })
                    if (isNotNilOrEmpty(dataMutate)) {
                        const { code, message } = isNotNilOrEmpty(
                            dataMutate.PostIntegrante
                        )
                            ? dataMutate.PostIntegrante
                            : dataMutate.UpdateIntegrante
                        setTitleModalMsj(message)
                        setLoadingMutate(false)
                        setOpenModalMsj(true)

                        setErrorModal(code === 200 ? false : true)
                        if (code === 200) {
                            if (isNotNilOrEmpty(dataMutate.UpdateIntegrante)) {
                                setBoolPut(true)
                                return
                            }
                            // await refetch()
                            resetForm()
                            // resetForm({
                            //     values: {
                            //         idGrupoFamiliar: 0,
                            //         nombre: '',
                            //         apellido: '',
                            //         email: '',
                            //         telefono: '',
                            //         // status: "",
                            //         fecha_nacimiento: new Date(),
                            //         id_tipo_doc_identidad: undefined,
                            //         num_doc_identidad: '',
                            //         // piso_ocupa: "",
                            //         genero: '',
                            //         id_parentesco: undefined,
                            //         representante: 'I',
                            //     },
                            // })
                        }

                        //  console.log('Messaget: ', message)

                        // resetForm();
                    } else if (dataMutate === null) {
                        setLoadingMutate(false)
                        setTitleModalMsj('Usuario no autorizado')
                        setErrorModal(true)
                        setOpenModalMsj(true)
                    }
                }
            } catch (err: any) {
                setLoadingMutate(false)
                console.log('error : ', err)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'Integrante no ha sido guardado: ' + err.message
                )
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [integrante, listadoIntegrantes]
    )

    const init = useMemo(() => {
        return isNotNilOrEmpty(integrante)
            ? {
                  idGrupoFamiliar: integrante?.grupoFamiliar.id,
                  id_tipo_doc_identidad: integrante?.tipoIdentificacion
                      ? integrante?.tipoIdentificacion.id
                      : 0,
                  num_doc_identidad: integrante?.num_doc_identidad,
                  nombre: integrante?.nombre,
                  apellido: integrante?.apellido,
                  telefono: integrante?.telefono,
                  email: integrante?.email,
                  genero: integrante?.genero
                      ? integrante.genero.toUpperCase()
                      : '0',
                  representante: integrante?.representante,
                  id_parentesco: integrante?.parentesco
                      ? integrante?.parentesco.id
                      : 0,
                  // piso_ocupa: integrante?.piso_ocupa,
                  // status: integrante?.status,
                  fecha_nacimiento: isNotNilOrEmpty(
                      integrante?.fecha_nacimiento
                  )
                      ? parseStringDate(integrante?.fecha_nacimiento!)
                      : new Date(),
              }
            : initialValues
    }, [integrante])

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
    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    // setOpenModal={setOpenModalMsj}
                    onClose={() => {
                        closeModalAuth()
                    }}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <ModalConfirmacion
                openModal={openModalConf}
                onConfirm={async () => {
                    //  setConfirmarRepresentante(true)
                    // onDelete(row.original)
                    setOpenModalConf(false)
                    await onIngresarIntegrante({ ...values! })
                }}
                mensaje="Este grupo familiar ya tiene un representante ¿Está seguro de asignar a este integrante como el nuevo representante?"
                onCancel={() => setOpenModalConf(false)}
            />
            {integrante && (
                <div className={classes.title}>
                    <Typography variant="overline">
                        {`Actualización de grupo familiar: ${integrante.nombre} ${integrante.apellido}`}
                    </Typography>
                </div>
            )}

            <form
                action="#"
                onSubmit={handleSubmit}
                // onReset={handleReset}
                className={classes.form}
            >
                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="idGrupoFamiliar"
                        handleChange={handleChange}
                        labetTitulo=" Grupo Familiar"
                        value={values.idGrupoFamiliar}
                        error={errors.idGrupoFamiliar}
                        touched={touched.idGrupoFamiliar}
                    >
                        <MenuItem value={0}> SELECCIONAR</MenuItem>
                        {!loadingListaGrupoFamiliar &&
                            !isNil(dataListaGrupoFamiliar) &&
                            isNotNilOrEmpty(
                                dataListaGrupoFamiliar.ListaGruposFamiliares
                            ) &&
                            dataListaGrupoFamiliar.ListaGruposFamiliares.map(
                                ({
                                    id,
                                    nombre_familiar,
                                    manzana,
                                    extension,
                                    villa,
                                }) => {
                                    return (
                                        <MenuItem
                                            value={id}
                                            key={
                                                'ListGrupoFamiliarFormIntegrante-' +
                                                id
                                            }
                                            style={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {`${nombre_familiar}-${
                                                manzana.manzana
                                            }${
                                                extension && !isEmpty(extension)
                                                    ? `-${villa}-${extension}`
                                                    : `-${villa}`
                                            }`}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_parentesco"
                        handleChange={handleChange}
                        labetTitulo="Parentesco"
                        value={values.id_parentesco}
                        error={errors.id_parentesco}
                        touched={touched.id_parentesco}
                    >
                        <MenuItem value={0}> SELECCIONAR</MenuItem>
                        {!loadingParentesco &&
                            !isNil(dataParentesco) &&
                            isNotNilOrEmpty(dataParentesco.ListaParentesco) &&
                            dataParentesco.ListaParentesco.map(
                                ({ id, parentesco }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'IngresarIntegranteFormParentesco-' +
                                                id
                                            }
                                            value={id}
                                            style={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {parentesco}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>
                </div>

                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_tipo_doc_identidad"
                        handleChange={handleChange}
                        labetTitulo="Tipo de identificacion"
                        value={values.id_tipo_doc_identidad}
                        error={errors.id_tipo_doc_identidad}
                    >
                        <MenuItem value={0}> SELECCIONAR</MenuItem>
                        {!loadingListadoTipoID &&
                            dataListaGrupoFamiliar &&
                            isNotNilOrEmpty(
                                dataListadoTipoID?.ListaTipoIdentificacion
                            ) &&
                            dataListadoTipoID?.ListaTipoIdentificacion.map(
                                ({ id, tipo_identificacion }) => {
                                    return (
                                        <MenuItem
                                            key={id}
                                            value={id}
                                            style={{
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {tipo_identificacion}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>

                    <TextField
                        className={classes.textbox}
                        id="num_doc_identidad"
                        name="num_doc_identidad"
                        label="Numero de identidad"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.num_doc_identidad}
                        error={
                            touched.num_doc_identidad &&
                            isNotNilOrEmpty(errors.num_doc_identidad)
                        }
                        helperText={
                            touched.num_doc_identidad
                                ? errors.num_doc_identidad
                                : undefined
                        }
                        required
                    />
                </div>
                <div className={classes.contentLastTextBox}>
                    <TextField
                        className={classes.textbox}
                        id="nombre"
                        name="nombre"
                        label="Nombres del Integrante"
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nombre}
                        error={touched.nombre && isNotNilOrEmpty(errors.nombre)}
                        helperText={touched.nombre ? errors.nombre : undefined}
                        required
                    />
                    <TextField
                        className={classes.textbox}
                        id="apellido"
                        name="apellido"
                        label="Apellidos del Integrante"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.apellido}
                        error={
                            touched.apellido && isNotNilOrEmpty(errors.apellido)
                        }
                        helperText={
                            touched.apellido ? errors.apellido : undefined
                        }
                        required
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                </div>

                <div className={classes.contentLastTextBox}>
                    <FormControlDate
                        classes={classes}
                        id="fecha_nacimiento"
                        disableFuture={true}
                        setFieldValue={setFieldValue}
                        error={errors.fecha_nacimiento}
                        touched={touched.fecha_nacimiento}
                        labelTitulo={'Ingrese Fecha de Nacimiento'}
                        value={values.fecha_nacimiento}
                    />

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="genero"
                        handleChange={handleChange}
                        labetTitulo="Genero"
                        value={values.genero}
                        error={errors.genero}
                    >
                        <MenuItem value={'0'}>SELECCIONAR</MenuItem>
                        <MenuItem
                            style={{
                                textTransform: 'uppercase',
                            }}
                            key="ListGeneroMasculino"
                            value={'MASCULINO'}
                        >
                            Masculino
                        </MenuItem>
                        <MenuItem
                            style={{
                                textTransform: 'uppercase',
                            }}
                            key="ListGeneroFemenino"
                            value={'FEMENINO'}
                        >
                            Femenino
                        </MenuItem>
                        <MenuItem
                            style={{
                                textTransform: 'uppercase',
                            }}
                            key="ListGeneroOtro"
                            value={'OTRO'}
                        >
                            Otro
                        </MenuItem>
                    </FormControlHeader>
                </div>
                <div className={classes.contentLastTextBox}>
                    <TextField
                        className={classes.textbox}
                        id="telefono"
                        name="telefono"
                        label="Numero celular"
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
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                    <TextField
                        className={classes.textbox}
                        id="email"
                        name="email"
                        label="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        type="email"
                        error={touched.email && isNotNilOrEmpty(errors.email)}
                        helperText={touched.email ? errors.email : undefined}
                    />
                </div>

                {usuarioState &&
                    (usuarioState.tipo_usuario === TipoUsuario.ADMIN ||
                        usuarioState.tipo_usuario ===
                            TipoUsuario.OPERATIVO) && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: 10,
                                marginLeft: 45,
                                marginRight: 45,
                            }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={
                                                init.representante === 'A'
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFieldValue(
                                                        'representante',
                                                        'A'
                                                    )
                                                } else {
                                                    setFieldValue(
                                                        'representante',
                                                        'I'
                                                    )
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body1"
                                            style={{ color: colors.grey[700] }}
                                        >
                                            Representante
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        </div>
                    )}

                <div className={classes.contentButtons}>
                    <div></div>

                    {/* <LoadingButton
                        loading={loadingMutate}
                        loadingPosition="start"
                        onClick={() => {
                            resetForm({
                                isSubmitting: true,
                            })
                        }}
                        variant="text"
                        startIcon={<SaveIcon />}
                    >
                        ResetForm
                    </LoadingButton> */}
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

export default IntegranteFormIngresar
