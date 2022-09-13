import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Grid,
    MenuItem,
    TextField,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { values, isNil } from 'ramda'
import React, { useCallback, useMemo, useState } from 'react'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import FormControlHeader from '../core/input/form-control-select'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import * as yup from 'yup'
import { useFormik } from 'formik'
import FormControlDate from '../core/input/form-control-date'
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import esLocale from 'date-fns/locale/es'
import { FormatLetterCaseUpper } from 'mdi-material-ui'
import DateFnsUtils from '@date-io/date-fns'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { FC } from 'react'
import { usePostLLegadaVisitanteMutation } from './use-visitante'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            // padding: '60px',
            // // minWidth: "820px",
            // borderRadius: '10px',
            // textAlign: 'center',
            padding: '5%',
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
            // width: "70%"
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
    identificacion_visitante: undefined,
    placa_vehiculo: '',
})

const validationSchema = yup.object().shape({
    identificacion_visitante: yup
        .string()
        .matches(/^[0-9\s]+$/, 'Solo números')
        .min(10, 'La cantidad de digitos debe ser mayor o igual 10 ')
        .max(15, 'La cantidad de digitos debe ser menor o igual 15 ')
        .required('Campo requerido'),
    placa_vehiculo: yup
        .string()
        .matches(
            /[aA-zZ]{2,3}[0-9]{3,4}/g,
            'Formato Invalido, sin guión (-). Ej: ABC1234'
        ),
})

export interface IVisitaneMoradorLlegadaVariables {
    identificacion_visitante: string
    placa_vehiculo: string
}

interface IProps {
    moradorLlegada?: IVisitaneMoradorLlegadaVariables
    id: number
}

const FormLlegadaVisitante: FC<IProps> = ({ id, moradorLlegada, children }) => {
    const router = useRouter()
    const classes = useStyles()

    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [mutate] = usePostLLegadaVisitanteMutation()

    const closeModalAuth = () => {
        if (openModalMsj) {
            // refetch().then(() => {
            router.push({ pathname: '/visitantes/listado-visitante' })
            // })
            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }
    const onSubmit = useCallback(
        async ({ identificacion_visitante, placa_vehiculo }) => {
            try {
                // console.log(
                //     'Identificacion: ',
                //     identificacion_visitante,
                //     'placa:',
                //     placa
                // )

                const { data } = await mutate({
                    variables: {
                        id,
                        identificacion_visitante,
                        placa_vehiculo: placa_vehiculo
                            ? String(placa_vehiculo).toUpperCase()
                            : '',
                    },
                })

                if (isNotNilOrEmpty(data)) {
                    const { code, message } = data.LLegadaVisitante

                    setTitleModalMsj(message)
                    setLoadingMutate(false)
                    // setOpenModalMsj(true)
                    setErrorModal(code === 200 ? false : true)
                    if (code === 200) {
                        // if (isNotNilOrEmpty(data.PutVisitanteMorador)) {
                        //     setBoolPut(true)
                        //     setOpenModalMsj(true)
                        //     return
                        // }
                        // await refetch()
                        resetForm()
                    } else {
                        setErrorModal(true)
                    }
                    setOpenModalMsj(true)
                }
            } catch (error: any) {
                setLoadingMutate(false)
                console.log('error : ', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(error.message)
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]
    )

    const init = useMemo(() => {
        if (isNotNilOrEmpty(moradorLlegada)) {
            return {
                identificacion_visitante:
                    moradorLlegada?.identificacion_visitante,
                placa_vehiculo: moradorLlegada?.placa_vehiculo,
            }
        }
        return initialValues
    }, [moradorLlegada])
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
                    onClose={() => closeModalAuth()}
                    //  setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}

            {children}
            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <div>
                    <div>
                        <TextField
                            className={classes.textbox}
                            id="identificacion_visitante"
                            name="identificacion_visitante"
                            label="Identificación del Visitante"
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.identificacion_visitante}
                            error={
                                touched.identificacion_visitante &&
                                isNotNilOrEmpty(errors.identificacion_visitante)
                            }
                            helperText={
                                touched.identificacion_visitante
                                    ? errors.identificacion_visitante
                                    : undefined
                            }
                            // required
                        />

                        <TextField
                            className={classes.textbox}
                            id="placa_vehiculo"
                            name="placa_vehiculo"
                            label="Placa del Vehiculo"
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.placa_vehiculo}
                            error={
                                touched.placa_vehiculo &&
                                isNotNilOrEmpty(errors.placa_vehiculo)
                            }
                            helperText={
                                touched.placa_vehiculo
                                    ? errors.placa_vehiculo
                                    : undefined
                            }
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
                </div>
            </form>
        </Box>
    )
}

export default FormLlegadaVisitante
