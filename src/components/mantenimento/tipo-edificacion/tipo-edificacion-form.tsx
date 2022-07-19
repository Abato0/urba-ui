/* eslint-disable react-hooks/rules-of-hooks */
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { isNil } from 'ramda'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import ModalAuth from '../../core/input/dialog/modal-dialog'
import { useRouter } from 'next/router'
import {
    IResultQueryTipoEdificacion,
    usePostTipoEdificacionMutation,
    usePutTipoEdificacionMutation,
} from './use-tipo-edificacion'

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
    tipo_edificacion: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    tipo_edificacion: yup.string().required('Campo requerido'),
})

interface IProps {
    tipoEdificacionObj?: IResultQueryTipoEdificacion
    id?: number
}

export const IngresarTipoEdificacionForm: FC<IProps> = ({
    tipoEdificacionObj,
    id,
}) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            router.push({ pathname: '/mantenimiento/tipo-edificacion/listado' })
        }
        // }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boolPut, openModalMsj])

    const [mutate] = isNil(tipoEdificacionObj)
        ? usePostTipoEdificacionMutation()
        : usePutTipoEdificacionMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(tipoEdificacionObj)
            ? {
                tipo_edificacion: tipoEdificacionObj?.tipo_edificacion,
            }
            : initialValues
    }, [tipoEdificacionObj])

    const onSubmit = useCallback(async ({ tipo_edificacion }) => {
        try {
            if (isNotNilOrEmpty(tipo_edificacion)) {
                const { data } = isNil(tipoEdificacionObj)
                    ? await mutate({
                        variables: {
                            tipo_edificacion,
                        },
                    })
                    : await mutate({
                        variables: {
                            id,
                            tipo_edificacion,
                        },
                    })

                if (isNotNilOrEmpty(data)) {
                    const { message } = isNotNilOrEmpty(data.PutTipoEdificacion)
                        ? data.PutTipoEdificacion
                        : data.PostTipoEdificacion
                    setTitleModalMsj(message)

                    //   setTimeout(() => {

                    //   }, 2000);

                    setErrorModal(false)
                    // setMensajeModalMsj(dataMutate.message);
                    setOpenModalMsj(true)
                    if (isNotNilOrEmpty(data.PutTipoEdificacion)) {
                        setBoolPut(true)
                    }
                    resetForm()
                } else {
                    setOpenModalMsj(true)
                    setErrorModal(false)
                    setTitleModalMsj('Usuario no autorizado')
                }
            }
        } catch (error: any) {
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setMensajeModalMsj(
                'El Tipo de edificacion no ha sido guardado: ' + error.message
            )
            setOpenModalMsj(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    onClose={() => setOpenModalMsj(false)}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <Typography variant="h5">
                {' '}
                Registro de Tipos de Edificaciones
            </Typography>
            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <div className={classes.contentLastTextBox}>
                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="tipo_edificacion"
                        value={values.tipo_edificacion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Tipo de Edificacion"
                        margin="normal"
                        error={
                            touched.tipo_edificacion &&
                            isNotNilOrEmpty(errors.tipo_edificacion)
                        }
                        helperText={
                            touched.tipo_edificacion
                                ? errors.tipo_edificacion
                                : undefined
                        }
                        required
                    />
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
