import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
} from '@material-ui/core'
import { useCallback, useState } from 'react'
import ModalAuth from '../core/input/dialog/modal-dialog'
import * as yup from 'yup'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { useFormik } from 'formik'
import FormControlHeader from '../core/input/form-control-select'
import { Listado_lugares_image } from '../../utils/keys'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import { ButtonCargarImagen } from '../vehiculo/buttonCargarImagen'
import { ButtonVerImage } from '../vehiculo/buttonVerImagen'
import ModalImagenFile from '../core/input/dialog/modal-ver-imagen-file'
import {
    usePostImagenBienvenidaMutation,
    useListadoImagenesBienvenidaQuery,
} from './use-imagenes-bienvenida'

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
            marginRight: theme.spacing(3),
            marginLeft: theme.spacing(3),
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
            marginTop: theme.spacing(6),
        },
        textbox: {
            margin: theme.spacing(1),
            minWidth: theme.spacing(29),
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
    nombre: '',
    lugar: undefined,
    imagen: undefined,
})

const validationSchema = yup.object().shape({
    nombre: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    lugar: yup.string().required('Campo requerido'),
    imagen: yup.mixed().required('Imagen requerida'),
})

export const IngresarImagenBienvenida = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)
    const [fileSeleccionado, setFileSeleccionado] = useState<
        File | null | undefined
    >(null)
    const [openModalImagen, setOpenModalImage] = useState(false)

    const [mutate] = usePostImagenBienvenidaMutation()
    const { refetch } = useListadoImagenesBienvenidaQuery()
    const onSubmit = useCallback(async ({ nombre, lugar, imagen }) => {
        try {
            if (
                isNotNilOrEmpty(nombre) &&
                isNotNilOrEmpty(lugar) &&
                isNotNilOrEmpty(imagen)
            ) {
                setLoadingMutate(true)

                const { data } = await mutate({
                    variables: {
                        nombre: String(nombre).toUpperCase(),
                        lugar: String(lugar).toUpperCase(),
                        imagen,
                    },
                })

                if (isNotNilOrEmpty(data) && data.PostImagenSitio) {
                    const { code, message } = data.PostImagenSitio
                    setTitleModalMsj(message)
                    if (code === 200) {
                        resetForm()
                        await refetch()
                        setErrorModal(false)
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
        } catch (error) {
            setLoadingMutate(false)
            console.log('error : ', error)
            setTitleModalMsj('Registro Fallido')
            // setMensajeModalMsj(
            //     'El registro del vehiculo no se ha realizado: ' +
            //     error.message
            // )
            setOpenModalMsj(true)
            setErrorModal(true)
        }
    }, [])

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
        initialValues,
        onSubmit,
        validationSchema,
    })

    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={() => setOpenModalMsj(false)}
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
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.textbox}
                            id="nombre"
                            name="nombre"
                            label="Nombre de la imagen"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nombre}
                            error={
                                touched.nombre && isNotNilOrEmpty(errors.nombre)
                            }
                            helperText={
                                touched.nombre ? errors.nombre : undefined
                            }
                            required
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlHeader
                            classes={classes}
                            handleBlur={handleBlur}
                            id="lugar"
                            handleChange={handleChange}
                            labetTitulo="Lugar"
                            value={values.lugar}
                        >
                            {Listado_lugares_image.map(({ label, value }) => {
                                return (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                )
                            })}
                        </FormControlHeader>
                    </Grid>

                    <Grid item xs={12}>
                        <ButtonCargarImagen
                            id="imagen"
                            label={'Imagen de Bienvenida'}
                            value={values.imagen}
                            onBlur={handleBlur}
                            onChange={(event: any) => {
                                setFieldValue(
                                    'imagen',
                                    event.currentTarget.files[0]
                                )
                            }}
                        >
                            {values.imagen && (
                                <ButtonVerImage
                                    onclick={() => {
                                        setFileSeleccionado(values.imagen)
                                        setOpenModalImage(true)
                                    }}
                                />
                            )}
                        </ButtonCargarImagen>
                    </Grid>
                </Grid>
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
