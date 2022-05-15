import { usePostAporteMutation } from './use-aporte'
import { FC, useCallback, useState } from 'react'
import {
    colors,
    makeStyles,
    createStyles,
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Typography,
    Button,
} from '@material-ui/core'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { equals } from 'ramda'
import { ETipoAporte } from '../core/input/dateSelect'
import { lightFormat } from 'date-fns'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // backgroundColor:"red",
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            padding: '60px',
            // minWidth: "320px",
            borderRadius: '10px',
            textAlign: 'center',
            // width: "100%",
            // height: "100%",
            backgroundColor: 'white',
            // marginTop: theme.spacing(2)
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
    })
)

const initialValues = Object.freeze({
    cuotas: 0,
    fecha_inicio: null,
    nombre_aporte: '',
    tipo_aporte: '',
    valor_mensual: '',
})

const validationSchema = yup.object().shape({
    cuotas: yup
        .number()
        .required('Campo requerido')
        .min(0, 'El numero de cuotas debe ser mayor a 1'),
    fecha_inicio: yup.date().nullable(),
    nombre_aporte: yup.string().required('Campo requerido'),
    valor_mensual: yup.number().required('Campo requerido'),
    tipo_aporte: yup.string().required('Campo requerido'),
})

export const AporteFormIngresar: FC = () => {
    const [mutate, data, loading, error] = usePostAporteMutation()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const classes = useStyles()

    const onSubmit = useCallback(
        async (
            { cuotas, fecha_inicio, nombre_aporte, tipo_aporte, valor_mensual },
            { setSubmitting }
        ) => {
            try {
                if (
                    isNotNilOrEmpty(cuotas) &&
                    isNotNilOrEmpty(fecha_inicio) &&
                    isNotNilOrEmpty(nombre_aporte) &&
                    isNotNilOrEmpty(tipo_aporte) &&
                    isNotNilOrEmpty(valor_mensual)
                ) {
                    const { data: dataMutate, loading: loadingMutate } =
                        await mutate({
                            variables: {
                                cuotas: cuotas,
                                fecha_inicio: lightFormat(
                                    fecha_inicio,
                                    'yyyy-MM-dd'
                                ),
                                nombre_aporte,
                                tipo_aporte,
                                valor_mensual,
                            },
                        })
                    if (
                        !loadingMutate &&
                        isNotNilOrEmpty(dataMutate) &&
                        isNotNilOrEmpty(dataMutate.PostAporte)
                    ) {
                        const { message } = dataMutate.PostAporte
                        setErrorModal(false)
                        setTitleModalMsj(message)
                        setOpenModalMsj(true)
                        resetForm()
                    } else if (!loadingMutate && dataMutate === null) {
                        setErrorModal(true)
                        setTitleModalMsj('Usuario no autorizado')
                        setOpenModalMsj(true)
                    }
                }
            } catch (err) {
                setErrorModal(true)
                setOpenModalMsj(true)
                setTitleModalMsj('Error al Ingresar Aporte')
                setMensajeModalMsj((err as Error).message)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Typography variant="h5"> Ingreso de Aporte</Typography>
            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <Box
                    sx={{
                        flexDirection: 'column',
                    }}
                    className={classes.contentLastTextBox}
                >
                    <FormControl
                        variant="filled"
                        className={classes.formControl}
                    >
                        <InputLabel id="tipo_aporte_label">
                            Tipo de Aporte
                        </InputLabel>
                        <Select
                            labelId="tipo_aporte_label"
                            id="tipo_aporte"
                            name="tipo_aporte"
                            value={values.tipo_aporte}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={classes.textbox}
                            required
                        >
                            <MenuItem value={ETipoAporte.implementacion}>
                                {ETipoAporte.implementacion}
                            </MenuItem>
                            <MenuItem value={ETipoAporte.mantenimiento}>
                                {ETipoAporte.mantenimiento}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        className={classes.textbox}
                        id="nombre_aporte"
                        name="nombre_aporte"
                        label="Nombre del Aporte"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nombre_aporte}
                        error={
                            touched.nombre_aporte &&
                            isNotNilOrEmpty(errors.nombre_aporte)
                        }
                        helperText={
                            touched.nombre_aporte
                                ? errors.nombre_aporte
                                : undefined
                        }
                        required
                    />
                </Box>
                <div className={classes.contentLastTextBox}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className={classes.textbox}
                            id="fecha_inicio"
                            name="fecha_inicio"
                            label="Fecha pago inicial"
                            inputVariant="outlined"
                            format="MM/dd/yyyy"
                            value={values.fecha_inicio}
                            onChange={(value) =>
                                setFieldValue('fecha_inicio', value)
                            }
                            error={
                                touched.fecha_inicio &&
                                isNotNilOrEmpty(errors.fecha_inicio)
                            }
                            helperText={
                                touched.fecha_inicio
                                    ? errors.fecha_inicio
                                    : undefined
                            }
                            disablePast={true}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        className={classes.textbox}
                        id="cuotas"
                        name="cuotas"
                        label="Numero de cuotas"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type={'number'}
                        value={
                            equals(
                                values.tipo_aporte,
                                ETipoAporte.mantenimiento
                            )
                                ? values.cuotas
                                : 1
                        }
                        error={touched.cuotas && isNotNilOrEmpty(errors.cuotas)}
                        helperText={touched.cuotas ? errors.cuotas : undefined}
                        disabled={
                            values.tipo_aporte === ETipoAporte.implementacion
                        }
                        required
                    />
                </div>
                <div
                    style={{ marginRight: 245 }}
                    className={classes.contentLastTextBox}
                >
                    <TextField
                        className={classes.textbox}
                        id="valor_mensual"
                        name="valor_mensual"
                        label="Valor Mensual"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type={'number'}
                        value={values.valor_mensual}
                        error={
                            touched.valor_mensual &&
                            isNotNilOrEmpty(errors.valor_mensual)
                        }
                        helperText={
                            touched.valor_mensual
                                ? errors.valor_mensual
                                : undefined
                        }
                        required
                    />
                    <div></div>
                </div>
                <div className={classes.contentButtons}>
                    <div></div>
                    <Button type="submit" variant="outlined">
                        {' '}
                        Guardar
                    </Button>
                </div>
            </form>
        </Box>
    )
}

export default AporteFormIngresar
