import { useQuery } from '@apollo/client'
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Paper,
    Button,
    ListItem,
    List,
    Fab,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import ImageIcon from '@material-ui/icons/Image'
import { useFormik } from 'formik'
import { isNil, join } from 'ramda'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import { isNotNilOrEmpty, isNilOrEmpty } from '../../utils/is-nil-empty'
import { IAporteVariables, useListarAporteQuery } from '../aporte/use-aporte'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { listadoGrupoFamiliar } from '../grupo-familiar/grupo-familiar-typeDefs'
import { usePostPago } from './use-pago'
import { grey } from '@material-ui/core/colors'
import { rangoFechaAportePagoService } from '../../utils/parseDate'
import FormControlHeader from '../core/input/form-control-select'
import FormControlDate from '../core/input/form-control-date'

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
            marginTop: theme.spacing(6),
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
            justifyContent: 'center',
            // alignItems: "center",
            padding: theme.spacing(4),
            minWidth: 500,
            backgroundColor: grey[700],
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
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
        },
        title: {
            // display: "flex",
            // flexDirection: "row",
            width: '100%',
            // backgroundColor: "red"
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
            fontWeight: "lighter",
            fontFamily: "bold",
        },
    })
)

const initialValues = Object.freeze({
    idGrupoFamiliar: undefined,
    descripcion: '',
    id_aporte: undefined,
    cod_recibo: '',
    fecha_recibo: new Date(),
})

const validationSchema = yup.object().shape({
    id_aporte: yup.number().required(),
    idGrupoFamiliar: yup.number().required(),
    descripcion: yup.string(),
    cod_recibo: yup.string().required(),
    fecha_recibo: yup.date().required(),
})

interface IPagoMes {
    f_pago: string
    monto: number
}

export const PagoFormIngresar = () => {
    const [file, setFile] = React.useState<File | any>()

    const [pagoMensual, setPagoMensual] = React.useState<IPagoMes[]>([])
    const [addFechaPago, setAddFechaPago] = React.useState<string | undefined>(
        ''
    )
    const [addMonto, setAddMonto] = React.useState<number | undefined>()

    const onSubmit = React.useCallback(
        async (
            {
                idGrupoFamiliar,
                descripcion,
                // monto,
                id_aporte,
                // fecha_pago,
                cod_recibo,
                fecha_recibo,
            },
            { setSubmitting }
        ) => {
            try {
                if (
                    isNotNilOrEmpty(idGrupoFamiliar) &&
                    isNotNilOrEmpty(pagoMensual) &&
                    isNotNilOrEmpty(id_aporte) &&
                    // isNotNilOrEmpty(fecha_pago) &&
                    isNotNilOrEmpty(cod_recibo) &&
                    isNotNilOrEmpty(fecha_recibo) &&
                    isNotNilOrEmpty(file)
                ) {
                    const ArrPagoMes = pagoMensual.map(({ f_pago, monto }) => {
                        return `${f_pago},${monto}`
                    })
                    const pagoMes = join(';', ArrPagoMes)
                    const pago = {
                        idGrupoFamiliar: idGrupoFamiliar,
                        idAporte: id_aporte,
                        imagen_recibo: file!,
                        fecha_subida: new Date(),
                        pagoMes: pagoMes,
                        // fecha_pago: fecha_pago,
                        descripcion: descripcion,
                        // monto: monto,
                        cod_recibo: cod_recibo,
                        fecha_recibo: fecha_recibo,
                    }
                    const { data, loading, error } = await mutate({
                        variables: { ...pago },
                    })
                    if (
                        !loading &&
                        isNotNilOrEmpty(data) &&
                        isNotNilOrEmpty(data.PostPago)
                    ) {
                        const { message } = data.PostPago
                        setErrorModal(false)
                        setOpenModalMsj(true)
                        setTitleModalMsj(message)
                        setPagoMensual([])
                        resetForm()
                    } else if (!loading && data === null) {
                        setOpenModalMsj(true)
                        setTitleModalMsj('Usuario no autorizado')
                        setErrorModal(true)
                    }
                }
            } catch (err) {
                console.log('error : ', err)
                setTitleModalMsj('Pago Fallido')
                setMensajeModalMsj(
                    'Pago no se ha realizado el pago: ' + (err as Error).message
                )
                setOpenModalMsj(true)
                setErrorModal(true)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        initialValues,
        onSubmit,
        validationSchema,
    })

    const { data, loading, error } = useQuery(listadoGrupoFamiliar, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })

    const {
        data: dataListarAporte,
        loading: loadingListarAporte,
        error: errorListarAporte,
    } = useListarAporteQuery()

    const [dataGrupoFamiliar, setDataGrupoFamiliar] = React.useState([])
    const [dataListaAporte, setListaAporte] = React.useState<
        IAporteVariables[]
    >([])

    const [mutate] = usePostPago()
    const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = React.useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>('')
    const [errorModal, setErrorModal] = React.useState<boolean>(false)

    const [aporteSeleccionado, setAporteSeleccionado] =
        React.useState<IAporteVariables>()

    const onDrop = React.useCallback(([file]: [File]) => {
        setFile(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/jpeg , image/png',
        noKeyboard: true,
        multiple: false,
        onDrop: onDrop as any,
    })

    React.useEffect(() => {
        if (!loading && !isNil(data)) {
            setDataGrupoFamiliar(data.ListaGruposFamiliares)
            console.log('data: ', data.ListaGruposFamiliares)
        }
    }, [data, loading])

    React.useEffect(() => {
        if (!loadingListarAporte && !isNil(dataListarAporte)) {
            setListaAporte(dataListarAporte.ListaAportes)
            console.log('data: ', dataListarAporte.ListaAportes)
        }
    }, [dataListarAporte, loadingListarAporte])

    React.useEffect(() => {
        if (
            isNotNilOrEmpty(values.id_aporte) &&
            isNotNilOrEmpty(dataListaAporte)
        ) {
            const result = dataListaAporte.find(
                (aporte) => aporte.id === values.id_aporte
            )
            setFieldValue('monto', result?.valor_mensual)
            setAporteSeleccionado(result)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataListaAporte, values.id_aporte])

    const MenuItemArrFecha = (arrString: string[]) => {
        const acum: any[] = []
        for (let index = 0; index < arrString.length; index++) {
            acum.push(
                <MenuItem value={arrString[index]}>{arrString[index]}</MenuItem>
            )
        }
        return acum
    }

    const arrFecha = React.useMemo(() => {
        if (isNotNilOrEmpty(aporteSeleccionado)) {
            return rangoFechaAportePagoService(aporteSeleccionado!)
        }
    }, [aporteSeleccionado])

    const agregarPagoMes = React.useCallback(() => {
        const result = pagoMensual.find(({ f_pago }) => f_pago === addFechaPago)
        if (
            isNil(result) &&
            isNotNilOrEmpty(addMonto) &&
            isNotNilOrEmpty(addFechaPago)
        ) {
            setPagoMensual([
                ...pagoMensual,
                { f_pago: addFechaPago!, monto: addMonto! },
            ])
            setAddFechaPago(undefined)
            setAddMonto(0)
        }
    }, [pagoMensual, addMonto, addFechaPago])

    const eliminarPago = React.useCallback(
        (fecha_recibida: string) => {
            const verif = pagoMensual.filter(
                ({ f_pago }) => f_pago !== fecha_recibida
            )
            setPagoMensual(verif)
            // setAddFechaPago(undefined);
            // setAddMonto(0);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pagoMensual, addMonto, addFechaPago]
    )

    const classes = useStyles()
    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    // setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    onClose={() => setOpenModalMsj(false)}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <Typography variant="h5" className={classes.title}>
                {' '}
                Ingreso de Pago
            </Typography>
            {isNotNilOrEmpty(aporteSeleccionado) && (
                <Paper className={classes.containerLabelPago}>
                    <Typography
                        className={classes.labelMonto}
                        variant="overline"
                    >
                        Monto a pagar : ${aporteSeleccionado?.valor_mensual}{' '}
                    </Typography>
                </Paper>
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
                        labetTitulo=" Grupo Familiar del Deposito"
                        value={values.idGrupoFamiliar}
                    >
                        {!loading &&
                            dataGrupoFamiliar &&
                            dataGrupoFamiliar.map(({ id, nombre_familiar }) => {
                                return (
                                    <MenuItem key={id} value={id}>
                                        {nombre_familiar}
                                    </MenuItem>
                                )
                            })}
                    </FormControlHeader>

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_aporte"
                        handleChange={handleChange}
                        labetTitulo="Seleccione Aporte"
                        value={values.id_aporte}
                    >
                        {dataListaAporte &&
                            dataListaAporte.map(
                                ({ id, nombre_aporte, tipo_aporte }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'pago-listadoGrupoFamiliar-' +
                                                id
                                            }
                                            value={id}
                                        >{`${nombre_aporte} - ${tipo_aporte}`}</MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>
                </div>

                <div>
                    <TextField
                        className={classes.textbox}
                        id="cod_recibo"
                        name="cod_recibo"
                        label="Codigo del Recibo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.cod_recibo}
                        error={
                            touched.cod_recibo &&
                            isNotNilOrEmpty(errors.cod_recibo)
                        }
                        helperText={
                            touched.cod_recibo ? errors.cod_recibo : undefined
                        }
                        required
                    />

                    <FormControlDate
                        classes={classes}
                        id="fecha_recibo"
                        disableFuture={true}
                        setFieldValue={setFieldValue}
                        error={errors.fecha_recibo}
                        touched={touched.fecha_recibo}
                        labelTitulo={'Ingrese Fecha del Recibo'}
                        value={values.fecha_recibo}
                    />
                </div>

                <div>
                    <TextField
                        className={classes.textbox_descripcion}
                        id="descripcion"
                        name="descripcion"
                        label="Descripcion (Opcional)"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.descripcion}
                        error={
                            touched.descripcion &&
                            isNotNilOrEmpty(errors.descripcion)
                        }
                        helperText={
                            touched.descripcion ? errors.descripcion : undefined
                        }
                    />
                </div>

                <div>
                    <FormControl
                        variant="filled"
                        className={classes.formControl}
                    >
                        <InputLabel id="fecha_pago_label">
                            Seleccione Fecha
                        </InputLabel>
                        <Select
                            labelId="fecha_pago_label"
                            value={addFechaPago}
                            onChange={(e) =>
                                setAddFechaPago(e.target.value as string)
                            }
                        >
                            {isNotNilOrEmpty(arrFecha) &&
                                MenuItemArrFecha(arrFecha!)}
                        </Select>
                    </FormControl>

                    <TextField
                        className={classes.textbox}
                        label="Monto del Deposito"
                        onChange={(e) => setAddMonto(Number(e.target.value))}
                        type={'number'}
                        value={addMonto}
                    />

                    <Fab
                        onClick={agregarPagoMes}
                        size="small"
                        color="primary"
                        aria-label="add"
                        style={{ marginTop: '12px' }}
                    >
                        <AddIcon />
                    </Fab>
                </div>

                <Paper style={{ margin: '20px' }}>
                    {isNotNilOrEmpty(pagoMensual) && (
                        <List className={classes.list}>
                            {pagoMensual.map(({ f_pago, monto }) => {
                                return (
                                    <ListItem
                                        key={
                                            'pago-mensual-' +
                                            f_pago +
                                            '-' +
                                            monto
                                        }
                                        style={{ width: '100%' }}
                                        alignItems="center"
                                    >
                                        <div className={classes.listItem}>
                                            <Typography variant="overline">
                                                {`Fecha: ${f_pago} | Monto: $${monto}`}{' '}
                                            </Typography>

                                            <Fab
                                                // onClick={agregarPagoMes}
                                                size="small"
                                                color="primary"
                                                aria-label="Delete"
                                                onClick={() =>
                                                    eliminarPago(f_pago)
                                                }
                                                style={{ marginLeft: '20px' }}
                                            >
                                                <DeleteIcon />
                                            </Fab>
                                        </div>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )}
                </Paper>

                <Paper {...getRootProps()} className={classes.dropzone}>
                    <input {...getInputProps()} />
                    <ImageIcon fontSize="large" />
                    <Typography variant="overline">
                        {
                            'Haga click en este Cuadro para subir su imagen del recibo'
                        }
                    </Typography>
                    {!isNilOrEmpty(file) && (
                        <Typography variant="body2">
                            {' '}
                            {' *' + String(file?.path)}
                        </Typography>
                    )}
                </Paper>

                <div className={classes.contentButtons}>
                    <div></div>
                    <Button type="submit" variant="outlined">
                        {' '}
                        Enviar
                    </Button>
                </div>
            </form>
        </Box>
    )
}

export default PagoFormIngresar
