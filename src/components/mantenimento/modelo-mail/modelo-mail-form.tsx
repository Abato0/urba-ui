import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { isNil } from 'ramda'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import ModalAuth from '../../core/input/dialog/modal-dialog'
import { useRouter } from 'next/router'

import SaveIcon from '@material-ui/icons/Save'
import { LoadingButton } from '@mui/lab'

import {
    IResultQueryModeloMail,
    useListaModeloMailQuery,
    usePutModeloMailMutation,
} from './use-modelo-mail'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '60px',

            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            width: '80%',
            maxWidth: '750px',
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
            minWidth: theme.spacing(29),
            width: '100%',
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
            width: '100%',
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
    categoria: '',
    // titulo: '',
    asunto: '',
    textoSuperior: '',
    textoInferior: '',
    remitente: '',
    firma: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    categoria: yup
        .string()
        // .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    // titulo: yup.string().required('Campo requerido'),
    asunto: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    textoSuperior: yup
        .string()
        //  .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    textoInferior: yup
        .string()
        //   .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    remitente: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    firma: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
})

interface IProps {
    modeloObj: IResultQueryModeloMail
    id: number
}

export const IngresarModeloMailForm: FC<IProps> = ({ modeloObj, id }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    // const { refetch } = useListaModeloMailQuery()

    const onCloseModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/mantenimiento/modelo-mail/listado' })
            // })
        } else {
            setOpenModalMsj(false)
        }
    }

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         refetch().then(() => {
    //             router.push({ pathname: '/mantenimiento/modelo-mail/listado' })
    //         })
    //     }
    //     // }, 2000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boolPut, openModalMsj, router])

    const [mutate] = usePutModeloMailMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(modeloObj)
            ? {
                  categoria: modeloObj?.categoria,
                  // titulo: modeloObj?.titulo,
                  asunto: modeloObj?.asunto,
                  textoSuperior: modeloObj?.textoSuperior,
                  textoInferior: modeloObj?.textoInferior,
                  remitente: modeloObj?.remitente,
                  firma: modeloObj.firma,
              }
            : initialValues
    }, [modeloObj])

    const onSubmit = useCallback(
        async ({
            categoria,
            asunto,
            textoSuperior,
            textoInferior,
            remitente,
            firma,
        }) => {
            try {
                if (
                    isNotNilOrEmpty(categoria) &&
                    // isNotNilOrEmpty(titulo) &&
                    isNotNilOrEmpty(asunto) &&
                    isNotNilOrEmpty(textoSuperior) &&
                    isNotNilOrEmpty(textoInferior) &&
                    isNotNilOrEmpty(remitente) &&
                    isNotNilOrEmpty(firma)
                ) {
                    setLoadingMutate(true)
                    const { data } = await mutate({
                        variables: {
                            id,
                            categoria,
                            // titulo,
                            asunto: String(asunto).toUpperCase(),
                            textoSuperior,
                            textoInferior,
                            remitente: String(remitente).toUpperCase(),
                            firma: String(firma).toUpperCase(),
                        },
                    })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = data.PutModeloMail
                        setLoadingMutate(false)
                        setTitleModalMsj(message)

                        //   setTimeout(() => {

                        //   }, 2000);

                        // setMensajeModalMsj(dataMutate.message);

                        if (code === 200) {
                            setErrorModal(false)
                            if (isNotNilOrEmpty(data.PutModeloMail)) {
                                setBoolPut(true)

                                setOpenModalMsj(true)
                                return
                            }
                        } else {
                            setErrorModal(true)
                        }
                        setOpenModalMsj(true)

                        // resetForm();
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
                    onClose={onCloseModalAuth}
                    openModal={openModalMsj}
                    // setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {modeloObj
                        ? `Actualización de modelo de correo ${modeloObj.categoria}`
                        : ''}
                </Typography>
            </div>

            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="categoria"
                            value={values.categoria}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Categoria"
                            margin="normal"
                            error={
                                touched.categoria &&
                                isNotNilOrEmpty(errors.categoria)
                            }
                            helperText={
                                touched.categoria ? errors.categoria : undefined
                            }
                            required
                            disabled
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="remitente"
                            value={values.remitente}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Remitente"
                            margin="normal"
                            error={
                                touched.categoria &&
                                isNotNilOrEmpty(errors.remitente)
                            }
                            helperText={
                                touched.remitente ? errors.remitente : undefined
                            }
                            required
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="asunto"
                            multiline
                            value={values.asunto}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Asunto"
                            margin="normal"
                            error={
                                touched.asunto && isNotNilOrEmpty(errors.asunto)
                            }
                            helperText={
                                touched.asunto ? errors.asunto : undefined
                            }
                            required
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="textoSuperior"
                            value={values.textoSuperior}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Texto Superior"
                            multiline
                            minRows={2}
                            margin="normal"
                            error={
                                touched.textoSuperior &&
                                isNotNilOrEmpty(errors.textoSuperior)
                            }
                            helperText={
                                touched.textoSuperior
                                    ? errors.textoSuperior
                                    : undefined
                            }
                            required
                            // inputProps={{
                            //     style: { textTransform: 'uppercase' },
                            // }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="textoInferior"
                            multiline
                            minRows={2}
                            value={values.textoInferior}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="TextoInferior"
                            margin="normal"
                            error={
                                touched.textoInferior &&
                                isNotNilOrEmpty(errors.textoInferior)
                            }
                            helperText={
                                touched.textoInferior
                                    ? errors.textoInferior
                                    : undefined
                            }
                            required
                            // inputProps={{
                            //     style: { textTransform: 'uppercase' },
                            // }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.textbox}
                            variant="outlined"
                            id="firma"
                            value={values.firma}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Firma"
                            margin="normal"
                            error={
                                touched.firma && isNotNilOrEmpty(errors.firma)
                            }
                            helperText={
                                touched.firma ? errors.firma : undefined
                            }
                            required
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </Grid>
                </Grid>

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
