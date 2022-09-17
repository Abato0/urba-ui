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
    IResultQueryCalle,
    useListaCallesQuery,
    usePostCalleMutation,
    usePutCalleMutation,
} from './use-calle'
import SaveIcon from '@material-ui/icons/Save'
import { LoadingButton } from '@mui/lab'

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
    calle: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    calle: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
})

interface IProps {
    calleObj?: IResultQueryCalle
    id?: number
}

export const IngresarCalleForm: FC<IProps> = ({ calleObj, id }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    // const { refetch } = useListaCallesQuery()

    const onCloseModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/mantenimiento/calle/listado' })
            // })

            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         router.push({ pathname: '/mantenimiento/calle/listado' })
    //     }
    //     // }, 2000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boolPut, openModalMsj])

    const [mutate] = isNil(calleObj)
        ? usePostCalleMutation()
        : usePutCalleMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(calleObj)
            ? {
                  calle: calleObj?.calle,
              }
            : initialValues
    }, [calleObj])

    const onSubmit = useCallback(
        async ({ calle }) => {
            try {
                if (isNotNilOrEmpty(calle)) {
                    setLoadingMutate(true)
                    const { data } = isNil(calleObj)
                        ? await mutate({
                              variables: {
                                  calle: String(calle).toUpperCase(),
                              },
                          })
                        : await mutate({
                              variables: {
                                  id,
                                  calle: String(calle).toUpperCase(),
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = isNotNilOrEmpty(data.PutCalle)
                            ? data.PutCalle
                            : data.PostCalle

                        //   setTimeout(() => {

                        //   }, 2000);

                        // setMensajeModalMsj(dataMutate.message);

                        if (code === 200) {
                            setOpenModalMsj(false)
                            if (isNotNilOrEmpty(data.PutCalle)) {
                                setBoolPut(true)
                                return
                            }
                            // await refetch()
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
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'Calle no ha sido guardado: ' + error.message
                )
                setOpenModalMsj(true)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [calleObj, id]
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
                    onClose={onCloseModalAuth}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {calleObj
                        ? `Actualización de calle: ${calleObj.calle}`
                        : 'Registro del Calles'}
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
                        id="calle"
                        value={values.calle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Calles y Peatonales"
                        margin="normal"
                        error={touched.calle && isNotNilOrEmpty(errors.calle)}
                        helperText={touched.calle ? errors.calle : undefined}
                        required
                        inputProps={{ style: { textTransform: 'uppercase' } }}
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
            </form>
        </Box>
    )
}
