/* eslint-disable react-hooks/rules-of-hooks */
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    MenuItem,
    TextField,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ModalAuth from '../core/input/dialog/modal-dialog'
import * as yup from 'yup'
import { useFormik } from 'formik'
import FormControlHeader from '../core/input/form-control-select'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import {
    useSaveVehiculoMutation,
    useUpdateVehiculoMutation,
} from './use-vehiculo'
// import { useDropzone } from "react-dropzone";
import { useRouter } from 'next/router'
import { useListaModeloQuery } from '../mantenimento/modelo/use-modelo'
import { useListaMarcaQuery } from '../mantenimento/marca/use-marca'
import { useListaStatusVehiculoQuery } from '../mantenimento/status-vehiculo/use-status-vehiculo'
import { equals, isNil } from 'ramda'
import { useListaColorQuery } from '../mantenimento/color/use-color'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { ButtonCargarImagen } from './buttonCargarImagen'
import ModalImagenFile from '../core/input/dialog/modal-ver-imagen-file'
import { COLOR_PRIMARIO } from '../../utils/keys'
import { ButtonVerImage } from './buttonVerImagen'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // backgroundColor:"red",
            display: 'flex',
            flexDirection: 'column',
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            padding: '60px',
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 220,
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            // marginTop: theme.spacing(6),
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
        textbox_descripcion: {
            margin: theme.spacing(1),
            width: theme.spacing(60),
        },
        dropzone: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // alignContent: "center",
            // width: "100%",
            // alignItems: "center",
            padding: theme.spacing(4),
            minWidth: 500,
            backgroundColor: colors.red[400],
            color: 'white',
            maxWidth: 700,
        },
        button: {
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
                color: 'white',
            },
            color: 'white',
        },
        buttonVerImagen: {
            backgroundColor: COLOR_PRIMARIO,
            color: 'white',
            margin: theme.spacing(2),
            fontWeight: 'bold',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
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
        list: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',

            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
        },
        listItem: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },
        containerLabelPago: {
            marginTop: 20,
            padding: 15,
            color: 'white',
            background: colors.green[800],
        },
        labelMonto: {
            fontWeight: theme.typography.pxToRem(60),
            fontFamily: theme.typography.fontWeightBold,
        },
        buttonCargarFile: {
            display: 'flex',
            flexDirection: 'column',
            margin: theme.spacing(1),
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: colors.grey[500],
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1),
        },
        labelInfoButton: {
            // fontWeight: theme.typography.pxToRem(8),
            fontSize: theme.typography.pxToRem(9),
        },
    })
)

const initialValues = Object.freeze({
    idGrupoFamiliar: 0,
    // tipo_vehiculo: "",
    placa: '',
    id_marca: 0,
    id_color: 0,
    id_modelo: 0,
    id_status: 0,
    matriculaFrontal: null,
    matriculaReverso: null,
    cedulaFrontal: null,
    cedulaReverso: null,
    num_doc_identidad: '',
    // matriculaPdf: ""
})

export const FILE_SIZE = 10 * 1024 * 1024
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']

const validationSchema = yup.object().shape({
    idGrupoFamiliar: yup.number().required('Campo Requerido'),
    // tipo_vehiculo: yup.string().required("Campo Requerido"),
    placa: yup.string().matches(/[aA-zZ]{2,3}[0-9]{3,4}/g, "Formato Invalido, sin guión (-). Ej: ABC1234"),
    id_marca: yup.number().required('Campo Requerido'),
    id_color: yup.number().required('Campo Requerido'),
    id_modelo: yup.number().required('Campo Requerido'),
    id_status: yup.number().required('Campo Requerido'),
    matriculaFrontal: yup.mixed().nullable(),
    // .required("A file is required")
    // .test(
    //   "fileSize",
    //   "File too large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    matriculaReverso: yup.mixed().nullable(),
    // .required("A file is required")
    // .test(
    //   "fileSize",
    //   "File too large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    cedulaFrontal: yup.mixed().nullable(),
    // .required("A file is required")
    // .test(
    //   "fileSize",
    //   "File too large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // ),
    cedulaReverso: yup.mixed().nullable(),
    // .required("A file is required")
    // .test(
    //   "fileSize",
    //   "File too large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    num_doc_identidad: yup
        .string()
        .matches(/^[0-9]+$/, 'Solo numeros')
        .min(10, 'La cantidad de digitos debe ser mayor o igual 10 ')
        .max(15, 'La cantidad de digitos debe ser menor o igual 15 ')
        .required('Campo requerido'),
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // ),
})

export interface IVehiculoInputRegistro {
    idGrupoFamiliar: number
    placa: string
    id_marca: number
    id_color: number
    id_modelo: number
    id_status: number
    matriculaFrontal?: File
    matriculaReverso?: File
    cedulaFrontal?: File
    cedulaReverso?: File
    num_doc_identidad: string
    // matriculaPdf?: string;
}

interface IProps {
    vehiculo?: IVehiculoInputRegistro
    id?: number
}

const FormIngresarVehiculos: React.FC<IProps> = ({ vehiculo }) => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = React.useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>('')
    const [errorModal, setErrorModal] = React.useState<boolean>(false)

    const [boolPut, setBoolPut] = React.useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const {
        data: dataModelo,
        loading: loadingModelo,
        error: errorModelo,
    } = useListaModeloQuery()

    const {
        data: dataMarca,
        loading: loadingMarca,
        error: errorMarca,
    } = useListaMarcaQuery()

    const {
        data: dataStatus,
        loading: loadingStatus,
        error: errorStatus,
    } = useListaStatusVehiculoQuery()

    const {
        data: dataListadoColor,
        loading: loadingListadoColor,
        error: errorListadoColor,
    } = useListaColorQuery()

    const [file, setFile] = React.useState<File>()

    const {
        data: dataGrupoFamiliar,
        loading: loadingGrupoFamiliar,
        error: errorGrupoFamiliar,
    } = useListarGrupoFamiliar()

    // const onDrop = React.useCallback(([file]: [File]) => {
    //   setFile(file);
    // }, []);

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //   accept: "application/pdf , *.pdf",
    //   noKeyboard: true,
    //   multiple: false,
    //   onDrop,
    // });

    const init = React.useMemo(() => {
        // const {ma} = vehiculo

        if (!isNil(vehiculo)) {
            // const { matriculaPdf, ...props } = vehiculo;
            // console.log("props: ", props);

            console.log('vehiculos: ', vehiculo)
            return vehiculo
        } else {
            return initialValues
        }
    }, [vehiculo])

    const [mutate] = isNotNilOrEmpty(vehiculo)
        ? useUpdateVehiculoMutation()
        : useSaveVehiculoMutation()

    const router = useRouter()

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            router.push({ pathname: '/vehiculo/listado' })
        }
        // }, 2000);
    }, [boolPut, openModalMsj])

    const id: number = React.useMemo(() => {
        return Number(router.query.id)
    }, [router.query.id])

    const onSubmit = React.useCallback(
        async (
            {
                idGrupoFamiliar,
                placa,
                id_marca,
                id_color,
                id_modelo,
                id_status,
                matriculaFrontal,
                matriculaReverso,
                cedulaFrontal,
                cedulaReverso,
                num_doc_identidad,
            },
            { setSubmitting }
        ) => {
            try {
                if (
                    isNotNilOrEmpty(idGrupoFamiliar) &&
                    !equals(idGrupoFamiliar, 0)
                ) {
                    setLoadingMutate(true)
                    const { data, loading, error } = isNotNilOrEmpty(vehiculo)
                        ? await mutate({
                            variables: {
                                id,
                                // tipo_vehiculo,
                                placa,
                                id_marca,
                                id_color,
                                id_modelo,
                                id_status,
                                matriculaFrontal: matriculaFrontal
                                    ? matriculaFrontal
                                    : undefined,
                                matriculaReverso: matriculaReverso
                                    ? matriculaReverso
                                    : undefined,
                                cedulaFrontal: cedulaFrontal
                                    ? cedulaFrontal
                                    : undefined,
                                num_doc_identidad,
                                cedulaReverso: cedulaReverso
                                    ? cedulaReverso
                                    : undefined,
                            },
                        })
                        : await mutate({
                            variables: {
                                idGrupoFamiliar,
                                // tipo_vehiculo,
                                placa,
                                id_marca,
                                id_color,
                                id_modelo,
                                id_status,
                                matriculaFrontal,
                                matriculaReverso,
                                cedulaFrontal,
                                num_doc_identidad,
                                cedulaReverso,
                            },
                        })

                    if (!loading && isNotNilOrEmpty(data)) {
                        const { message } = isNotNilOrEmpty(data.PostVehiculo)
                            ? data.PostVehiculo
                            : data.UpdateVehiculo
                        setLoadingMutate(false)

                        console.log('data:', data)
                        setErrorModal(false)
                        setOpenModalMsj(true)
                        setTitleModalMsj(message)
                        if (isNotNilOrEmpty(data.UpdateVehiculo)) {
                            setBoolPut(true)
                        }

                        resetForm()
                    } else if (!loading && data === null) {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setTitleModalMsj('Usuario no autorizado')
                        setErrorModal(true)
                    }
                }
            } catch (error: any) {
                setLoadingMutate(false)
                console.log('error : ', error)
                setTitleModalMsj('Registro Fallido')
                setMensajeModalMsj(
                    'El registro del vehiculo no se ha realizado: ' +
                    error.message
                )
                setOpenModalMsj(true)
                setErrorModal(true)
            }
        },
        [file]
    )

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        setFieldValue,
        resetForm,
        isSubmitting,
        touched,
        values,
    } = useFormik({
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    const [openModalImagen, setOpenModalImage] = useState(false)
    const [fileSeleccionado, setFileSeleccionado] = useState<
        File | null | undefined
    >(null)

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
            {openModalImagen && (
                <ModalImagenFile
                    handleClose={() => setOpenModalImage(false)}
                    open={openModalImagen}
                    file={fileSeleccionado}
                />
            )}
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
                        id="idGrupoFamiliar"
                        handleChange={handleChange}
                        labetTitulo="Grupo Familiar del Deposito"
                        value={values.idGrupoFamiliar}
                        disabled={isNotNilOrEmpty(vehiculo)}
                    >
                        {!loadingGrupoFamiliar &&
                            isNotNilOrEmpty(dataGrupoFamiliar) &&
                            dataGrupoFamiliar?.ListaGruposFamiliares.map(
                                ({ id, nombre_familiar }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'vehiculo-listado-grupofamiliar-' +
                                                id
                                            }
                                            value={id}
                                        >
                                            {nombre_familiar}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>
                    <TextField
                        className={classes.textbox}
                        id="placa"
                        name="placa"
                        label="Placa del Vehiculo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.placa}
                        error={touched.placa && isNotNilOrEmpty(errors.placa)}
                        helperText={touched.placa ? errors.placa : undefined}
                        required
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                </div>

                <div>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_marca"
                        handleChange={handleChange}
                        labetTitulo="Marca"
                        value={values.id_marca}
                    >
                        {!loadingMarca &&
                            !isNil(dataMarca) &&
                            dataMarca.ListaMarca.map(({ id, marca }) => {
                                return (
                                    <MenuItem
                                        key={'ingreso-vehiculo-marca-' + id}
                                        value={id}
                                    >
                                        {marca}
                                    </MenuItem>
                                )
                            })}
                    </FormControlHeader>

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_modelo"
                        handleChange={handleChange}
                        labetTitulo="Modelo"
                        value={values.id_modelo}
                    >
                        {!loadingModelo &&
                            !isNil(dataModelo) &&
                            dataModelo.ListaModelo.map(({ id, modelo }) => {
                                return (
                                    <MenuItem
                                        key={'ingreso-vehiculo-modelo-' + id}
                                        value={id}
                                    >
                                        {modelo}
                                    </MenuItem>
                                )
                            })}
                    </FormControlHeader>
                </div>

                <div>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_color"
                        handleChange={handleChange}
                        labetTitulo="Color"
                        value={values.id_color}
                    >
                        {!loadingListadoColor &&
                            !isNil(dataListadoColor) &&
                            dataListadoColor.ListaColor.map(({ id, color }) => {
                                return (
                                    <MenuItem
                                        key={'ingreso-vehiculo-color-' + id}
                                        value={id}
                                    >
                                        {color}
                                    </MenuItem>
                                )
                            })}
                    </FormControlHeader>

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_status"
                        handleChange={handleChange}
                        labetTitulo="Status"
                        value={values.id_status}
                    >
                        {!loadingStatus &&
                            !isNil(dataStatus) &&
                            dataStatus.ListaStatusVehiculo.map(
                                ({ id, statusVehiculo }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'ingreso-vehiculo-statusVehiculo-' +
                                                id
                                            }
                                            value={id}
                                        >
                                            {statusVehiculo}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>
                </div>
                <div>
                    <TextField
                        className={classes.textbox}
                        id="num_doc_identidad"
                        name="num_doc_identidad"
                        label="Cedula del Propietario"
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

                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: '100%',
                        }}
                    >
                        <ButtonCargarImagen
                            id="matriculaFrontal"
                            label="Matricula frontal"
                            value={values.matriculaFrontal}
                            onBlur={handleBlur}
                            onChange={(event: any) => {
                                setFieldValue(
                                    'matriculaFrontal',
                                    event.currentTarget.files[0]
                                )
                            }}
                        >
                            {values.matriculaFrontal && (
                                <ButtonVerImage
                                    onclick={() => {
                                        setFileSeleccionado(
                                            values.matriculaFrontal
                                        )
                                        setOpenModalImage(true)
                                    }}
                                />
                            )}
                        </ButtonCargarImagen>

                        <ButtonCargarImagen
                            id="matriculaReverso"
                            label=" Matricula reverso"
                            value={values.matriculaReverso}
                            onBlur={handleBlur}
                            onChange={(event: any) => {
                                setFieldValue(
                                    'matriculaReverso',
                                    event.currentTarget.files[0]
                                )
                            }}
                        >
                            {values.matriculaReverso && (
                                <ButtonVerImage
                                    onclick={() => {
                                        setFileSeleccionado(
                                            values.matriculaReverso
                                        )
                                        setOpenModalImage(true)
                                    }}
                                />
                            )}
                        </ButtonCargarImagen>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        width: '100%',
                    }}
                >
                    <ButtonCargarImagen
                        id="cedulaFrontal"
                        label="Cedula frontal"
                        value={values.cedulaFrontal}
                        onBlur={handleBlur}
                        onChange={(event: any) => {
                            setFieldValue(
                                'cedulaFrontal',
                                event.currentTarget.files[0]
                            )
                        }}
                    >
                        {values.cedulaFrontal && (
                            <ButtonVerImage
                                onclick={() => {
                                    setFileSeleccionado(values.cedulaFrontal)
                                    setOpenModalImage(true)
                                }}
                            />
                        )}
                    </ButtonCargarImagen>

                    <ButtonCargarImagen
                        id="cedulaReverso"
                        label="Cedula reverso"
                        value={values.cedulaReverso}
                        onBlur={handleBlur}
                        onChange={(event: any) => {
                            setFieldValue(
                                'cedulaReverso',
                                event.currentTarget.files[0]
                            )
                        }}
                    >
                        {/* {values.cedulaReverso && values.cedulaReverso.type} */}

                        {values.cedulaReverso && (
                            <ButtonVerImage
                                onclick={() => {
                                    setFileSeleccionado(values.cedulaReverso)
                                    setOpenModalImage(true)
                                }}
                            />
                        )}
                    </ButtonCargarImagen>
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

export default FormIngresarVehiculos
