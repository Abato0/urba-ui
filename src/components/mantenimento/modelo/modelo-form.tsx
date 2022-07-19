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
    IResultQueryModelo,
    usePostModeloMutation,
    usePutModeloMutation,
} from './use-modelo'
import SaveIcon from '@material-ui/icons/Save'
import { LoadingButton } from '@mui/lab'
import { useListaModeloQuery } from './use-modelo'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '60px',

            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            // margin: theme.spacing(2),
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
    modelo: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    modelo: yup.string().required('Campo requerido'),
})

interface IProps {
    modeloObj?: IResultQueryModelo
    id?: number
}

export const IngresarModeloForm: FC<IProps> = ({ modeloObj, id }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    const { refetch } = useListaModeloQuery()


    const onCloseModalAuht = () => {
        if (openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/mantenimiento/marca/listado' })
            })
        } else {
            setOpenModalMsj(false)
        }
    }

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         refetch().then(() => {
    //             router.push({ pathname: '/mantenimiento/marca/listado' })
    //         })
    //     }
    //     // }, 2000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boolPut, openModalMsj, router])

    const [mutate] = isNil(modeloObj)
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
        usePostModeloMutation()
        : // eslint-disable-next-line react-hooks/rules-of-hooks
        usePutModeloMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(modeloObj)
            ? {
                modelo: modeloObj?.modelo,
            }
            : initialValues
    }, [modeloObj])

    const onSubmit = useCallback(
        async ({ modelo }) => {
            try {
                if (isNotNilOrEmpty(modelo)) {
                    setLoadingMutate(true)
                    const { data } = isNil(modeloObj)
                        ? await mutate({
                            variables: {
                                modelo,
                            },
                        })
                        : await mutate({
                            variables: {
                                id,
                                modelo,
                            },
                        })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = isNotNilOrEmpty(data.PutModelo)
                            ? data.PutModelo
                            : data.PostModelo
                        setLoadingMutate(false)
                        setTitleModalMsj(message)

                        //   setTimeout(() => {

                        //   }, 2000);


                        // setMensajeModalMsj(dataMutate.message);


                        if (code === 200) {
                            setErrorModal(false)
                            if (isNotNilOrEmpty(data.PutModelo)) {
                                setBoolPut(true)
                                return
                            }

                            await refetch()
                            resetForm()
                        } else {
                            setErrorModal(true)
                        }

                        setOpenModalMsj(true)

                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(false)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
            } catch (error: any) {
                setLoadingMutate(false)
                console.log('error.;', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'El modelo no ha sido guardado: ' + error.message
                )
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, modeloObj]
    )

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
                    onClose={onCloseModalAuht}
                    // setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {modeloObj
                        ? `Actualización de modelo: ${modeloObj.modelo}`
                        : 'Registro de modelo de vehiculo'}
                </Typography>
            </div>

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
                        id="modelo"
                        value={values.modelo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Modelo"
                        margin="normal"
                        error={touched.modelo && isNotNilOrEmpty(errors.modelo)}
                        helperText={touched.modelo ? errors.modelo : undefined}
                        required
                    />
                </div>
                <div className={classes.contentButtons}>
                    <div></div>
                    <LoadingButton
                        loading={loadingMutate}
                        loadingPosition="start"
                        type="submit"
                        variant="outlined"
                        startIcon={<SaveIcon />}
                    >
                        Guardar
                    </LoadingButton>
                </div>
            </form>
        </Box>
    )
}
