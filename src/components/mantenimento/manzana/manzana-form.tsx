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
    IResultQueryManzana,
    usePostManzanaMutation,
    usePutManzanaMutation,
} from './use-manzana'
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
            margin: theme.spacing(2),
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
    manzana: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    manzana: yup.string().required('Campo requerido'),
})

interface IProps {
    manzanaObj?: IResultQueryManzana
    id?: number
}

export const IngresarManzanaForm: FC<IProps> = ({ manzanaObj, id }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            router.push({ pathname: '/mantenimiento/manzana/listado' })
        }
        // }, 2000);
    }, [boolPut, openModalMsj, router])

    const [mutate] = isNil(manzanaObj)
        ? usePostManzanaMutation()
        : usePutManzanaMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(manzanaObj)
            ? {
                  manzana: manzanaObj?.manzana,
              }
            : initialValues
    }, [manzanaObj])

    const onSubmit = useCallback(
        async ({ manzana }) => {
            try {
                if (isNotNilOrEmpty(manzana)) {
                    setLoadingMutate(true)
                    const { data } = isNil(manzanaObj)
                        ? await mutate({
                              variables: {
                                  manzana,
                              },
                          })
                        : await mutate({
                              variables: {
                                  id,
                                  manzana,
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        const { message } = isNotNilOrEmpty(data.PutManzana)
                            ? data.PutManzana
                            : data.PostManzana
                        setLoadingMutate(false)
                        setTitleModalMsj(message)
                        setErrorModal(false)
                        setOpenModalMsj(true)
                        if (isNotNilOrEmpty(data.PutManzana)) {
                            setBoolPut(true)
                        }
                        resetForm()
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
                    'Manzana no ha sido guardado: ' + error.message
                )
                setOpenModalMsj(true)
            }
        },
        [id, manzanaObj]
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
                    setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {manzanaObj
                        ? `Actualización de manzana: ${manzanaObj.manzana}`
                        : 'Registro de Manzanas'}
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
                        id="manzana"
                        value={values.manzana}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Manzana"
                        margin="normal"
                        error={
                            touched.manzana && isNotNilOrEmpty(errors.manzana)
                        }
                        helperText={
                            touched.manzana ? errors.manzana : undefined
                        }
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
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        Guardar
                    </LoadingButton>
                </div>
            </form>
        </Box>
    )
}
