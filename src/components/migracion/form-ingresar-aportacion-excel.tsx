import {
    makeStyles,
    createStyles,
    colors,
    Paper,
    Typography,
    MenuItem,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { FileExcel } from 'mdi-material-ui'
import { grey } from '@material-ui/core/colors'
import FormControlHeader from '../core/input/form-control-select'
import { moduloMigracionPagos } from '../../utils/keys'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import {
    useMigracionPagoImplementacionMutation,
    useMigracionPagoMantenimientoMutation,
    useMigracionPagoTagMutation,
    useMigracionPagoOtrosMutation,
} from '../pago/use-pago'

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
            minWidth: '100px',
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
            display: 'flex',
            justifyContent: 'center',
            // alignItems: "center",
            padding: theme.spacing(4),
            //  minWidth: 500,
            backgroundColor: grey[700],
            color: 'white',
            maxWidth: 700,
            flexDirection: 'column',
            marginTop: theme.spacing(4),
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

const initialValues = {
    idModulo: undefined,
}

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    idModulo: yup.number().required('Campo requerido'),
})

export const FormIngresarExcelAportacion = () => {
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)
    const classes = useStyles()
    const [file, setFile] = useState<File | any>()

    const onDrop = useCallback(([file]: [File]) => {
        setFile(file)
    }, [])

    const [mutatePagoImplementacion] = useMigracionPagoImplementacionMutation()
    const [mutatePagoMantenimiento] = useMigracionPagoMantenimientoMutation()
    const [mutatePagoTag] = useMigracionPagoTagMutation()
    const [mutatePagoOtros] = useMigracionPagoOtrosMutation()

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        noKeyboard: true,
        multiple: false,
        onDrop: onDrop as any,
    })

    const onSubmit = useCallback(
        async ({ idModulo }, { setSubmitting }) => {
            try {
                if (!file) {
                    setTitleModalMsj('Archivo Requerido')
                    setErrorModal(true)
                    setOpenModalMsj(true)
                    return
                }
                if (idModulo && file) {
                    let result = {} as any
                    switch (idModulo) {
                        case 1:
                            result = await mutatePagoImplementacion({
                                variables: {
                                    file,
                                },
                            })
                            break
                        case 2:
                            result = await mutatePagoMantenimiento({
                                variables: {
                                    file,
                                },
                            })
                            break
                        case 3:
                            result = await mutatePagoTag({
                                variables: {
                                    file,
                                },
                            })
                            break
                        case 4:
                            result = await mutatePagoOtros({
                                variables: {
                                    file,
                                },
                            })
                            break
                    }

                    const { data } = result
                    if (isNotNilOrEmpty(data)) {
                        console.log('*****Data: ', data)
                        const { code, message } = isNotNilOrEmpty(
                            data.MigracionExcelPagosTag
                        )
                            ? data.MigracionExcelPagosTag
                            : isNotNilOrEmpty(
                                  data.MigracionExcelPagosImplementacion
                              )
                            ? data.MigracionExcelPagosImplementacion
                            : isNotNilOrEmpty(data.MigracionExcelOtros)
                            ? data.MigracionExcelOtros
                            : data.MigracionExcelUsuarioMorador

                        setTitleModalMsj(message)
                        if (code === 200) {
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
        [file]
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
        <>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    // setOpenModal={setOpenModalMsj}
                    onClose={() => {
                        //  closeModalAuth()
                        setOpenModalMsj(false)
                    }}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
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
                        id="idModulo"
                        handleChange={handleChange}
                        labetTitulo="Módulo"
                        value={values.idModulo}
                    >
                        {moduloMigracionPagos.map(({ label, value }) => {
                            return (
                                <MenuItem
                                    style={{
                                        textTransform: 'uppercase',
                                    }}
                                    value={value}
                                    key={label + value}
                                >
                                    {label}
                                </MenuItem>
                            )
                        })}
                    </FormControlHeader>
                </div>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Paper {...getRootProps()} className={classes.dropzone}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    // justifyContent: 'space-evenly',
                                }}
                            >
                                <input {...getInputProps()} />
                                <FileExcel fontSize="large" />
                                <Typography variant="overline">
                                    {
                                        'Haga click en este Cuadro para subir su imagen del recibo'
                                    }
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {!isNilOrEmpty(file) && (
                                    <Typography variant="body2">
                                        {' * ARCHIVO SUBIDO: ' +
                                            String(file?.path)}
                                    </Typography>
                                )}
                            </div>
                        </Paper>
                    </div>
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
        </>
    )
}
