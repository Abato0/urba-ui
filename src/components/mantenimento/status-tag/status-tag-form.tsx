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
import SaveIcon from '@material-ui/icons/Save'
import { LoadingButton } from '@mui/lab'
import {
    IResultQueryStatusTag,
    useListaStatusTagQuery,
    usePostStatusTagMutation,
    usePutStatusTagMutation,
} from './use-status-tag'
import { useTable } from 'react-table'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '60px',
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            margin: theme.spacing(2),
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
        title: {
            fontSize: theme.typography.pxToRem(12),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
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
    statusTag: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    statusTag: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
})

interface IProps {
    statusObj?: IResultQueryStatusTag
}

export const IngresarStatusTagForm: FC<IProps> = ({ statusObj }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)

    const { refetch } = useListaStatusTagQuery()

    const [mutatePost] = usePostStatusTagMutation()
    const [mutatePut] = usePutStatusTagMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(statusObj)
            ? {
                  statusTag: statusObj?.statusTag,
              }
            : initialValues
    }, [statusObj])

    const closeModalAuth = () => {
        if (openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/mantenimiento/status-tag/listado' })
            })

            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    const onSubmit = useCallback(
        async ({ statusTag }) => {
            try {
                if (isNotNilOrEmpty(statusTag)) {
                    setLoadingMutate(true)
                    const { data } = isNil(statusObj)
                        ? await mutatePost({
                              variables: {
                                  statusTag: String(statusTag).toUpperCase(),
                              },
                          })
                        : await mutatePut({
                              variables: {
                                  id: statusObj.id,
                                  statusTag: String(statusTag).toUpperCase(),
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = isNotNilOrEmpty(
                            data.PutStatusTag
                        )
                            ? data.PutStatusTag
                            : data.PostStatusTag
                        setLoadingMutate(false)
                        setTitleModalMsj(message)

                        //   setTimeout(() => {

                        //   }, 2000);

                        //   setErrorModal(false)
                        // setMensajeModalMsj(dataMutate.message);

                        if (code === 200) {
                            setErrorModal(false)
                            if (isNotNilOrEmpty(data.PutStatusTag)) {
                                setBoolPut(true)
                                setOpenModalMsj(true)
                                return
                            }
                            await refetch()
                            resetForm()
                        } else {
                            setErrorModal(true)
                        }
                        setOpenModalMsj(true)

                        // if (isNotNilOrEmpty(data.PutColor)) {
                        //     setBoolPutColor(true)
                        // } else if (isNotNilOrEmpty(data.PostColor)) {
                        //     await refetch()
                        // }
                        // resetForm()
                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(false)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
            } catch (error) {
                setLoadingMutate(false)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'Integrante no ha sido guardado: ' +
                        (error as Error).message
                )
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [statusObj]
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
                    // setOpenModal={setOpenModalMsj}
                    onClose={closeModalAuth}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {statusObj
                        ? `Actualización de Status de Tag: ${statusObj.statusTag}`
                        : 'Registro de Status de Tag'}
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
                        id="statusTag"
                        value={values.statusTag}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Status del Tag"
                        margin="normal"
                        error={
                            touched.statusTag &&
                            isNotNilOrEmpty(errors.statusTag)
                        }
                        helperText={
                            touched.statusTag ? errors.statusTag : undefined
                        }
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
