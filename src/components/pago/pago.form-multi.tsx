import {
    makeStyles,
    createStyles,
    colors,
    Box,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Fade,
    FormGroup,
    MenuItem,
    Fab,
    Paper,
    Grid,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import ModalAuth from '../core/input/dialog/modal-dialog'
import FormControlHeader from '../core/input/form-control-select'

import { SelectMeses } from '../core/input/select/select-meses'
import { SelectChangeEvent } from '@mui/material'
import { SelectAnios } from '../core/input/select/select-anios'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import { useDropzone } from 'react-dropzone'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ImageIcon from '@material-ui/icons/Image'
import { equals, filter, isNil, props } from 'ramda'
import { usePostPago } from './use-pago'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import { useListadoVehiculoFilterQuery } from '../vehiculo/use-vehiculo'
import { SelectHeader } from '../core/input/select/select-header'
import { useListadoValorTag } from '../mantenimento/valor-tag/use-valor-tag'
import { lightFormat } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { es } from 'date-fns/locale'
import { LoadingButton } from '@mui/lab'
import { Send as SendIcon } from 'mdi-material-ui'
import { rows } from '../core/input/data'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // backgroundColor:"red",
            display: 'flex',
            flexDirection: 'row',
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            padding: theme.spacing(5),
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            // width: "75%"
            //  minHeight: theme.spacing(40),
        },
        formGroupChecks: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            color: colors.grey[900],
            marginBottom: theme.spacing(2),
        },
        formControl: {
            // margin: theme.spacing(1),
            minWidth: 220,
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
        textBox: {
            borderWidth: '1px',
            margin: theme.spacing(1),
            // "&$cssFocused $notchedOutline": {
            //   borderWidth: "1px",
            //   borderColor: `${colors.deepPurple[400]} !important`,
            // },

            //   backgroundColor: "reed"
        },
        columnsTipoPagoMantenimiento: {
            display: 'flex',
            flexDirection: 'row',
        },

        formOtros: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        // formControl: {
        //   margin: theme.spacing(1),
        //   minWidth: 220,
        // },
        form: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            // marginTop: theme.spacing(6),
        },
        tipoPagoContainer: {
            //   backgroundColor: colors.indigo[200],
            width: '100%',
            margin: theme.spacing(2),
            padding: theme.spacing(2),
            //   borderRadius: theme.spacing(1),
            borderWidth: 2,
            borderBlockStyle: 'dashed',
            borderColor: colors.blueGrey[200],
            justifyContent: 'center',
            alignItems: 'center',
        },
        columns: {
            display: 'flex',
            flexDirection: 'column',
            // minWidth: theme.spacing(30),
            // width: '100%',
        },
        contianerFlex: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dropzone: {
            display: 'flex',
            justifyContent: 'center',
            // alignItems: "center",
            padding: theme.spacing(4),
            //  minWidth: 500,
            backgroundColor: grey[700],
            color: 'white',
            maxWidth: 700,
        },
        paperListPago: {
            backgroundColor: grey[700],
            marginBottom: theme.spacing(2),
        },

        titleTipoPago: {
            fontSize: theme.typography.pxToRem(18),
            color: colors.blueGrey[500],
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
            fontSize: theme.typography.pxToRem(11),
        },

        contentValorTag: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing(2),
            backgroundColor: colors.green[700],
            color: 'white',
        },

        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
        },

        contentCardTipoPago: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
        },

        title: {
            fontSize: theme.typography.pxToRem(14),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            fontWeight: 600,
            color: colors.grey[700],
        },

        totalContainer: {
            // border: "solid",
            display: 'flex',
            justifyContent: 'end',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            // width: 100,
        },
        containerLabelTotal: {
            backgroundColor: colors.grey[300],
            padding: theme.spacing(1),
            borderRadius: theme.spacing(1),
        },
        selectFecha: {
            display: 'flex',
            //   width: theme.spacing(10),
            margin: theme.spacing(1),
            flexDirection: 'column',
        },
    })
)

const initialValues = Object.freeze({
    idGrupoFamiliar: undefined,
    descripcion: '',
    //   id_aporte: undefined,
    cod_recibo: '',
    fecha_recibo: new Date(),
    // imagen_recibo: undefined,
    implementacion: undefined,
    // tag: undefined,
    otro: undefined,
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    idGrupoFamiliar: yup.number().required(),
    descripcion: yup.string(),
    cod_recibo: yup.string().nullable(),
    fecha_recibo: yup.date().required(),

    // imagen_recibo: yup
    //   .mixed()
    //   .test("fileSize", "The file is too large", (value) => {
    //     if (!value.length) return true; // attachment is optional
    //     return value[0].size <= 2000000;
    //   }),
    implementacion: yup
        .number()
        .min(0, 'No se acetan valores negativos')
        .nullable(),
    // tag: yup.number().nullable(),
    otro: yup.number().min(0, 'No se acetan valores negativos').nullable(),
})

interface IPagoMes {
    mes: string
    anio: number
    monto: number
}

interface IPagoTag {
    idVehiculo: number
    idValorTag: number
}

interface IGridPropsPagoTag {
    vehiculo: {
        id: number
        placa: string
    }
    valorTag: {
        id: number
        tipo_valor: string
        monto: number
    }
}

export const PagoFormMulti = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [pagoMantenimiento, setPagoMantenimiento] = React.useState<
        IPagoMes[]
    >([])
    const [mesMantenimiento, setMesMantenimiento] = React.useState<
        string | undefined
    >()
    const [anioMantenimiento, setAnioMantenimiento] = React.useState<
        number | undefined
    >()
    const [montoMantenimiento, setMontoMantenimiento] = React.useState<
        number | undefined
    >()

    const [checkImplementacion, setCheckImplementacion] =
        useState<boolean>(false)

    const [checkMantenimiento, setCheckMantenimiento] = useState<boolean>(false)
    const [checkTag, setCheckTag] = useState<boolean>(false)
    const [checkOtros, setChecOtros] = useState<boolean>(false)

    const [idVehiculoSeleccionado, setIdVehiculoSeleccionado] =
        React.useState<number>()

    //const [cantTags, setCantTags] = React.useState<number>(0);
    const [tipoTag, setTipoTag] = React.useState<string>('')
    const [pagoTag, setPagoTag] = React.useState<IPagoTag[]>([])
    const [idValorTag, setIdValorTag] = React.useState<number>()
    const [montoValorTag, setMontoValorTag] = React.useState<number>()

    const [file, setFile] = React.useState<File | any>()

    const [gridPropsValorTag, setGridValorTag] = useState<IGridPropsPagoTag[]>(
        []
    )

    const onDrop = useCallback(([file]: [File]) => {
        setFile(file)
    }, [])

    const {
        data: dataValorTag,
        loading: loadingValorTag,
        error: errorValorTag,
    } = useListadoValorTag()

    const {
        data: dataGrupoFamiliar,
        loading: loadingGrupoFamiliar,
        error: errorGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const [mutate] = usePostPago()

    const agregarPagoMantenimiento = useCallback(() => {
        if (
            !isNil(montoMantenimiento) &&
            montoMantenimiento > 0 &&
            !isNil(anioMantenimiento) &&
            !isNil(mesMantenimiento)
        ) {
            const filter = pagoMantenimiento.find(
                (pago) =>
                    equals(pago.anio, anioMantenimiento) &&
                    equals(pago.mes, mesMantenimiento)
            )
            if (isNil(filter)) {
                setPagoMantenimiento([
                    ...pagoMantenimiento,
                    {
                        monto: montoMantenimiento,
                        mes: mesMantenimiento,
                        anio: anioMantenimiento,
                    },
                ])
            }
        }
    }, [
        montoMantenimiento,
        anioMantenimiento,
        mesMantenimiento,
        pagoMantenimiento,
    ])

    const getTag = (id: number) => {
        return !isNil(dataValorTag) && !isNil(dataValorTag.ListaValorTag)
            ? dataValorTag.ListaValorTag.find((valorTag) => valorTag.id === id)
            : null
    }

    const getVehiculo = (id: number) => {
        return !isNil(dataListadoVehiculo) &&
            !isNil(dataListadoVehiculo.ListaVehiculoFilter)
            ? dataListadoVehiculo.ListaVehiculoFilter.find(
                  (vehiculo) => vehiculo.id === id
              )
            : null
    }

    const agregarPagoTag = useCallback(() => {
        if (!isNil(idValorTag) && !isNil(idVehiculoSeleccionado)) {
            const filter = pagoTag.find((pago) =>
                //   equals(pago.idValorTag, idValorTag) &&
                equals(pago.idVehiculo, idVehiculoSeleccionado)
            )
            if (isNil(filter)) {
                setPagoTag([
                    ...pagoTag,
                    {
                        idValorTag: idValorTag,
                        idVehiculo: idVehiculoSeleccionado,
                    },
                ])
                const valor_tag = getTag(idValorTag)
                const vehiculo_get = getVehiculo(idVehiculoSeleccionado)
                setGridValorTag([
                    ...gridPropsValorTag,
                    {
                        vehiculo: {
                            id: vehiculo_get?.id!,
                            placa: vehiculo_get?.placa!,
                        },
                        valorTag: {
                            id: valor_tag?.id!,
                            monto: valor_tag?.valor!,
                            tipo_valor: valor_tag?.tipo_tag!,
                        },
                    },
                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridPropsValorTag, idValorTag, idVehiculoSeleccionado, pagoTag])

    const eliminarPagoMantenimiento = useCallback(
        (mes: string, anio: number, monto: number) => {
            if (isNotNilOrEmpty(pagoMantenimiento)) {
                const result = pagoMantenimiento.filter(
                    (pago) => {
                        if (pago.anio === anio && pago.mes === mes) {
                            return false
                        } else {
                            return true
                        }
                    }
                    // !equals(pago.monto, monto)
                )

                setPagoMantenimiento(result)
            }
        },
        [pagoMantenimiento]
    )

    const eliminarPagoTag = useCallback(
        (idVehiculo: number) => {
            if (
                isNotNilOrEmpty(pagoTag) &&
                isNotNilOrEmpty(gridPropsValorTag)
            ) {
                const result = pagoTag.filter(
                    (pago) => !equals(pago.idVehiculo, idVehiculo)
                )

                const resultGrid = gridPropsValorTag.filter(
                    (pagoGrid) => !equals(pagoGrid.vehiculo.id, idVehiculo)
                )

                setPagoTag(result)
                setGridValorTag(resultGrid)
            }
        },
        [pagoTag, gridPropsValorTag]
    )

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg , image/png',
        noKeyboard: true,
        multiple: false,
        onDrop: onDrop as any,
    })

    const onSubmit = useCallback(
        async ({
            idGrupoFamiliar,
            cod_recibo,
            fecha_recibo,
            descripcion,
            implementacion,
            // tag,
            otro,
        }) => {
            try {
                console.log('dataFecha: ', fecha_recibo)

                if (isNil(file)) {
                    setErrorModal(true)
                    setOpenModalMsj(true)
                    setTitleModalMsj('Imagen de recibo requerido')
                    return
                }
                if (
                    isNotNilOrEmpty(idGrupoFamiliar) &&
                    isNotNilOrEmpty(fecha_recibo)
                ) {
                    const pago = {
                        idGrupoFamiliar: idGrupoFamiliar,
                        cod_recibo: cod_recibo,
                        // descripcion: descripcion,
                        fecha_recibo: lightFormat(fecha_recibo, 'yyyy-MM-dd'),
                        fecha_subida: new Date(),
                        imagen_recibo: file!,
                        implementacion: implementacion,
                        mantenimiento: pagoMantenimiento,
                        otros:
                            isNotNilOrEmpty(descripcion) &&
                            isNotNilOrEmpty(otro)
                                ? {
                                      descripcion: descripcion,
                                      monto: otro,
                                  }
                                : undefined,
                        tag: [...pagoTag],
                    }
                    const { data, error } = await mutate({
                        variables: { ...pago },
                    })
                    if (
                        isNotNilOrEmpty(data) &&
                        isNotNilOrEmpty(data.PostPago)
                    ) {
                        const { code, message } = data.PostPago
                        code !== 200
                            ? setErrorModal(true)
                            : setErrorModal(false)
                        setErrorModal(false)
                        setOpenModalMsj(true)
                        setTitleModalMsj(message)
                    } else if (data === null) {
                        setOpenModalMsj(true)
                        setTitleModalMsj('Usuario no autorizado')
                        setErrorModal(true)
                    }
                }
            } catch (error) {
                console.log('error : ', error)
                setTitleModalMsj('Pago Fallido')
                setMensajeModalMsj(
                    'Pago no se ha realizado el pago: ' +
                        (error as Error).message
                )
                setOpenModalMsj(true)
                setErrorModal(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [file, pagoMantenimiento, pagoTag]
    )

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        setFieldValue,

        touched,
        values,
    } = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })

    const {
        data: dataListadoVehiculo,
        loading: loadingListadoVehiculo,
        error: errorListadoVehicullo,
    } = useListadoVehiculoFilterQuery({
        idGrupoFamiliar: values.idGrupoFamiliar,
    })

    const sumaPagoTag = useCallback(() => {
        // let res = 0
        if (isNotNilOrEmpty(gridPropsValorTag)) {
            return gridPropsValorTag.reduce((call, { valorTag }) => {
                return valorTag.monto + call
            }, 0)

            // gridPropsValorTag.forEach(({ valorTag }) => {
            //     res = res + valorTag.monto
            // })
        }
        return 0
    }, [gridPropsValorTag])

    const sumaPagoMantenimiento = useCallback(() => {
        let res = 0
        if (isNotNilOrEmpty(pagoMantenimiento)) {
            pagoMantenimiento.forEach(({ monto }) => {
                res = res + monto
            })
        }
        return res
    }, [pagoMantenimiento])

    const sumaTotal = useMemo(() => {
        const implementacion = values.implementacion || 0
        const otro = values.otro || 0

        const pagoTag = sumaPagoTag() || 0
        const pagoMantenimieno = sumaPagoMantenimiento() || 0

        return pagoTag + pagoMantenimieno + implementacion + otro
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values, gridPropsValorTag, pagoMantenimiento])

    useEffect(() => {
        if (!checkImplementacion) {
            setFieldValue('implementacion', undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkImplementacion])

    useEffect(() => {
        if (!checkMantenimiento) {
            setPagoMantenimiento([])
            setMesMantenimiento(undefined)
            setAnioMantenimiento(undefined)
        }
    }, [checkMantenimiento])
    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    // setOpenModal={setOpenModalMsj}
                    onClose={() => setOpenModalMsj(false)}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.columns}>
                {/* <div className={classes.title}>
          <Typography variant="overline">Registro de Pagos</Typography>
        </div> */}
                <form
                    action="#"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    className={classes.form}
                >
                    <div className={classes.columns}>
                        <FormGroup
                            row={true}
                            className={classes.formGroupChecks}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // style={{
                                        //     color: colors.deepPurple[400],
                                        // }}
                                        onChange={(e) =>
                                            setCheckImplementacion(
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label={
                                    <Typography variant="overline">
                                        Implementación
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // style={{
                                        //     color: colors.deepPurple[400],
                                        // }}
                                        onChange={(e) =>
                                            setCheckMantenimiento(
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label={
                                    <Typography variant="overline">
                                        Mantenimiento
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // style={{
                                        //     color: colors.deepPurple[400],
                                        // }}
                                        onChange={(e) =>
                                            setCheckTag(e.target.checked)
                                        }
                                    />
                                }
                                label={
                                    <Typography variant="overline">
                                        TAG
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // style={{
                                        //     color: colors.deepPurple[400],
                                        // }}
                                        onChange={(e) =>
                                            setChecOtros(e.target.checked)
                                        }
                                    />
                                }
                                label={
                                    <Typography variant="overline">
                                        Otro
                                    </Typography>
                                }
                            />
                        </FormGroup>

                        <div>
                            <FormControlHeader
                                classes={classes}
                                handleBlur={handleBlur}
                                id="idGrupoFamiliar"
                                handleChange={handleChange}
                                labetTitulo=" Grupo Familiar"
                                value={values.idGrupoFamiliar}
                            >
                                {!loadingGrupoFamiliar &&
                                    !isNil(dataGrupoFamiliar) &&
                                    !isNil(
                                        dataGrupoFamiliar.ListaGruposFamiliares
                                    ) &&
                                    dataGrupoFamiliar.ListaGruposFamiliares.map(
                                        ({ id, nombre_familiar }) => {
                                            return (
                                                <MenuItem
                                                    key={'grupoFamliar-' + id}
                                                    value={id}
                                                >
                                                    <Typography
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                    >
                                                        {nombre_familiar}
                                                    </Typography>
                                                </MenuItem>
                                            )
                                        }
                                    )}
                            </FormControlHeader>
                            <TextField
                                id="cod_recibo"
                                name="cod_recibo"
                                onChange={handleChange}
                                className={classes.textBox}
                                placeholder="Codigo del Recibo"
                                value={values.cod_recibo}
                                error={
                                    touched.cod_recibo &&
                                    isNotNilOrEmpty(errors.cod_recibo)
                                }
                                helperText={
                                    touched.cod_recibo
                                        ? errors.cod_recibo
                                        : undefined
                                }
                                inputProps={{
                                    style: { textTransform: 'uppercase' },
                                }}
                                //   multiline={true}
                            />
                            <MuiPickersUtilsProvider
                                locale={es}
                                utils={DateFnsUtils}
                            >
                                <KeyboardDatePicker
                                    style={{
                                        marginTop: '1%',
                                    }}
                                    id={'fecha_recibo'}
                                    label={'Fecha del recibo'}
                                    value={values.fecha_recibo}
                                    name={'fecha_recibo'}
                                    // onChange={handleChange}
                                    onChange={(e) =>
                                        setFieldValue('fecha_recibo', e)
                                    }
                                    format="dd MMM yyyy"
                                    error={
                                        touched.fecha_recibo &&
                                        isNotNilOrEmpty(errors.fecha_recibo)
                                    }
                                    helperText={
                                        touched.fecha_recibo
                                            ? errors.fecha_recibo
                                            : undefined
                                    }
                                    disableFuture={true}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Paper
                                {...getRootProps()}
                                className={classes.dropzone}
                            >
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
                        </div>

                        {/* <div> */}
                        <Fade in={checkImplementacion} unmountOnExit>
                            <div className={classes.tipoPagoContainer}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    Implementacion
                                </Typography>
                                <div className={classes.contentCardTipoPago}>
                                    <TextField
                                        id="implementación"
                                        name="implementacion"
                                        className={classes.textBox}
                                        placeholder="Monto Implementacion"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.implementacion}
                                        error={
                                            touched.implementacion &&
                                            isNotNilOrEmpty(
                                                errors.implementacion
                                            )
                                        }
                                        helperText={
                                            touched.implementacion
                                                ? errors.implementacion
                                                : undefined
                                        }
                                        type={'number'}
                                        inputProps={{ inputProps: { min: 0 } }}
                                    />
                                </div>
                            </div>
                        </Fade>

                        <Fade in={checkMantenimiento} unmountOnExit>
                            <div className={classes.tipoPagoContainer}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    Mantenimiento
                                </Typography>
                                <div className={classes.totalContainer}>
                                    <div
                                        className={classes.containerLabelTotal}
                                    >
                                        <Typography variant="overline">
                                            Subtotal por Mantenimiento USD
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                $
                                                {sumaPagoMantenimiento().toFixed(
                                                    2
                                                )}
                                            </span>
                                        </Typography>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        // margin: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '70%',
                                            marginRight: '4%',
                                        }}
                                    >
                                        <SelectMeses
                                            handleChange={(
                                                e: SelectChangeEvent
                                            ) =>
                                                setMesMantenimiento(
                                                    String(e.target.value)
                                                )
                                            }
                                            value={mesMantenimiento}
                                            label={'Mes'}
                                            id={'mes_manteniento'}
                                            style={{ width: '60%' }}
                                        />

                                        <SelectAnios
                                            handleChange={(
                                                e: SelectChangeEvent
                                            ) =>
                                                setAnioMantenimiento(
                                                    Number(e.target.value)
                                                )
                                            }
                                            value={anioMantenimiento}
                                            label={'Año'}
                                            id={'anio_manteniento'}
                                            style={{ width: '60%' }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            // width: "20%"
                                        }}
                                    >
                                        <div className={classes.contianerFlex}>
                                            <TextField
                                                className={classes.textBox}
                                                placeholder="Monto"
                                                type={'number'}
                                                onChange={(e) =>
                                                    setMontoMantenimiento(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classes.contianerFlex}
                                            style={{
                                                width: '10%',
                                            }}
                                        >
                                            <Fab
                                                size="small"
                                                aria-label="add"
                                                style={{
                                                    marginTop: '-14px',
                                                    backgroundColor:
                                                        colors.deepPurple[400],
                                                }}
                                                onClick={
                                                    agregarPagoMantenimiento
                                                }
                                            >
                                                <AddIcon
                                                    style={{ color: 'white' }}
                                                />
                                            </Fab>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {isNotNilOrEmpty(pagoMantenimiento) && (
                                        <Paper
                                            elevation={4}
                                            className={classes.paperListPago}
                                        >
                                            <Grid
                                                container
                                                spacing={4}
                                                style={{
                                                    padding: 15,
                                                }}
                                            >
                                                {pagoMantenimiento.map(
                                                    (
                                                        { anio, mes, monto },
                                                        index
                                                    ) => {
                                                        return (
                                                            <Grid
                                                                key={
                                                                    'Grid PagoMantenimiento-' +
                                                                    index
                                                                }
                                                                item
                                                                xs={6}
                                                                md={3}
                                                            >
                                                                <Paper
                                                                    className={
                                                                        classes.itemListPago
                                                                    }
                                                                    elevation={
                                                                        1
                                                                    }
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

                                                                                // width: "100%",
                                                                                // height:"100%"
                                                                                // padding: 5,
                                                                                overflow:
                                                                                    'auto',
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                className={
                                                                                    classes.itemLabel
                                                                                }
                                                                                variant="overline"
                                                                            >{`${mes}-${anio} \n Monto: $${monto} `}</Typography>
                                                                            {/* <Typography
                                                                                className={
                                                                                    classes.itemLabel
                                                                                }
                                                                                variant="overline"
                                                                            >{}</Typography> */}
                                                                        </div>
                                                                        <div>
                                                                            <Fab
                                                                                size="small"
                                                                                color="primary"
                                                                                aria-label="add"
                                                                                // style={{
                                                                                //     padding: 12,
                                                                                //     marginRight: 10,
                                                                                // }}
                                                                                onClick={() =>
                                                                                    eliminarPagoMantenimiento(
                                                                                        mes,
                                                                                        anio,
                                                                                        monto
                                                                                    )
                                                                                }
                                                                                // onClick={agregarPagoMantenimiento}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </Fab>
                                                                        </div>
                                                                    </div>
                                                                </Paper>
                                                            </Grid>
                                                        )
                                                    }
                                                )}
                                            </Grid>
                                        </Paper>
                                    )}
                                </div>
                            </div>
                        </Fade>

                        <Fade in={checkTag} unmountOnExit>
                            <div className={classes.tipoPagoContainer}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    TAG
                                </Typography>
                                <div
                                    style={{ margin: 20 }}
                                    className={classes.totalContainer}
                                >
                                    <div
                                        className={classes.containerLabelTotal}
                                    >
                                        <Typography variant="overline">
                                            Subtotal por Tags USD
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    marginLeft: 8,
                                                }}
                                            >
                                                ${sumaPagoTag().toFixed(2)}
                                            </span>
                                        </Typography>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '75%',
                                        }}
                                    >
                                        <SelectHeader
                                            handleChange={(
                                                e: SelectChangeEvent
                                            ) =>
                                                setIdVehiculoSeleccionado(
                                                    Number(e.target.value)
                                                )
                                            }
                                            value={idVehiculoSeleccionado}
                                            id={'vehiculosSelect'}
                                            label={'Vehiculos'}
                                            style={{
                                                width: '60%',
                                            }}
                                        >
                                            {!loadingListadoVehiculo &&
                                                !isNil(
                                                    values.idGrupoFamiliar
                                                ) &&
                                                !isNil(dataListadoVehiculo) &&
                                                isNotNilOrEmpty(
                                                    dataListadoVehiculo.ListaVehiculoFilter
                                                ) &&
                                                dataListadoVehiculo.ListaVehiculoFilter.map(
                                                    ({
                                                        id,
                                                        placa,
                                                        marca,
                                                        modelo,
                                                        color,
                                                    }) => {
                                                        return (
                                                            <MenuItem
                                                                value={id}
                                                                key={
                                                                    'listadoVehiculoFormPago' +
                                                                    id
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="inherit"
                                                                    style={{
                                                                        textTransform:
                                                                            'uppercase',
                                                                    }}
                                                                >
                                                                    {`${placa} ${marca.marca} ${modelo.modelo} ${color.color}`}
                                                                </Typography>
                                                            </MenuItem>
                                                        )
                                                    }
                                                )}
                                        </SelectHeader>

                                        <SelectHeader
                                            style={{
                                                width: '60%',
                                            }}
                                            handleChange={(
                                                e: SelectChangeEvent
                                            ) =>
                                                setIdValorTag(
                                                    Number(e.target.value)
                                                )
                                            }
                                            value={idValorTag}
                                            id={'tipoTagSelect'}
                                            label={'Concepto del Tag'}
                                        >
                                            {!loadingValorTag &&
                                                !isNil(dataValorTag) &&
                                                isNotNilOrEmpty(
                                                    dataValorTag.ListaValorTag
                                                ) &&
                                                dataValorTag.ListaValorTag.map(
                                                    ({
                                                        id,
                                                        tipo_tag,
                                                        valor,
                                                    }) => {
                                                        return (
                                                            <MenuItem
                                                                value={id}
                                                                key={
                                                                    'ListadoTag' +
                                                                    id
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="inherit"
                                                                    style={{
                                                                        textTransform:
                                                                            'uppercase',
                                                                    }}
                                                                >
                                                                    {`${tipo_tag} - $${valor}`}
                                                                </Typography>
                                                            </MenuItem>
                                                        )
                                                    }
                                                )}
                                        </SelectHeader>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '25%',
                                        }}
                                    >
                                        <Fab
                                            size="small"
                                            aria-label="add"
                                            style={{
                                                marginTop: '18px',
                                                backgroundColor:
                                                    colors.deepPurple[400],
                                            }}
                                            onClick={() => {
                                                agregarPagoTag()
                                            }}
                                        >
                                            <AddIcon
                                                style={{ color: 'white' }}
                                            />
                                        </Fab>
                                    </div>
                                </div>

                                <div>
                                    {isNotNilOrEmpty(gridPropsValorTag) && (
                                        <Paper
                                            elevation={4}
                                            className={classes.paperListPago}
                                        >
                                            <Grid
                                                container
                                                spacing={4}
                                                style={{
                                                    padding: 15,
                                                }}
                                            >
                                                {gridPropsValorTag.map(
                                                    (
                                                        { valorTag, vehiculo },
                                                        index
                                                    ) => {
                                                        return (
                                                            <Grid
                                                                key={index}
                                                                item
                                                                xs={6}
                                                                md={3}
                                                            >
                                                                <Paper
                                                                    key={index}
                                                                    className={
                                                                        classes.itemListPago
                                                                    }
                                                                    elevation={
                                                                        1
                                                                    }
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
                                                                            // padding: 5,
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

                                                                                // width: "100%",
                                                                                // height:"100%"
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
                                                                            >{`Vehiculo: ${vehiculo.placa}  \n Tag: ${valorTag.tipo_valor}`}</Typography>
                                                                        </div>

                                                                        <div>
                                                                            <Fab
                                                                                size="small"
                                                                                color="primary"
                                                                                aria-label="add"
                                                                                style={{
                                                                                    padding: 12,
                                                                                    marginRight: 10,
                                                                                }}
                                                                                onClick={() =>
                                                                                    eliminarPagoTag(
                                                                                        vehiculo.id
                                                                                    )
                                                                                }
                                                                                // onClick={agregarPagoMantenimiento}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </Fab>
                                                                        </div>
                                                                    </div>
                                                                </Paper>
                                                            </Grid>
                                                        )
                                                    }
                                                )}
                                            </Grid>
                                        </Paper>
                                    )}
                                </div>
                            </div>
                        </Fade>

                        {/* <div className={classes.formOtros}> */}
                        <Fade in={checkOtros} unmountOnExit>
                            <div className={classes.tipoPagoContainer}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    Otro
                                </Typography>
                                <div
                                    className={classes.contentCardTipoPago}
                                    style={{}}
                                >
                                    <div style={{ width: '80%' }}>
                                        <TextField
                                            style={{ width: '90%' }}
                                            id="descripcion"
                                            name="descripcion"
                                            label="Descripcion (Opcional)"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={4}
                                            value={values.descripcion}
                                            error={
                                                touched.descripcion &&
                                                isNotNilOrEmpty(
                                                    errors.descripcion
                                                )
                                            }
                                            helperText={
                                                touched.descripcion
                                                    ? errors.descripcion
                                                    : undefined
                                            }
                                            className={classes.textBox}
                                            placeholder="Descripcion del pago Otros"
                                            multiline={true}
                                        />
                                    </div>
                                    <div style={{ marginTop: '3%' }}>
                                        <TextField
                                            id="otro"
                                            name="otro"
                                            value={values.otro}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.otro &&
                                                isNotNilOrEmpty(errors.otro)
                                            }
                                            helperText={
                                                touched.otro
                                                    ? errors.otro
                                                    : undefined
                                            }
                                            className={classes.textBox}
                                            placeholder="Monto Otros"
                                            type={'number'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Fade>
                        <div className={classes.contentButtons}>
                            <div
                                style={{ margin: '0px 20px' }}
                                className={classes.totalContainer}
                            >
                                <div className={classes.containerLabelTotal}>
                                    <Typography variant="overline">
                                        <> Total del Aporte USD</>
                                        <span
                                            style={{
                                                marginLeft: 8,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            $
                                            {sumaTotal
                                                ? sumaTotal.toFixed(2)
                                                : (0).toFixed(2)}
                                        </span>
                                    </Typography>
                                </div>
                            </div>

                            <LoadingButton
                                loading={loadingMutate}
                                loadingPosition="start"
                                type="submit"
                                variant="text"
                                endIcon={<SendIcon />}
                            >
                                Enviar
                            </LoadingButton>
                        </div>
                    </div>
                </form>
            </div>

            {/* <Button variant="contained" component="label">
        Subir archivo
        <input type={"file"} accept="image/png, image/gif, image/jpeg" hidden />
      </Button> */}
        </Box>
    )
}
